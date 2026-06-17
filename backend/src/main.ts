import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser = require('cookie-parser');
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { envConfigService } from './config/env-config.service';
import { instance } from './infrastructure/logging/winston.logger';
import {
    HttpExceptionFilter,
    AllExceptionsFilter,
} from './core/filters/http-exception.filter';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            instance: instance,
        }),
    });

    // Trust proxy headers from Dokploy Traefik
    app.getHttpAdapter().getInstance().set('trust proxy', 1);

    // Security Headers via Helmet
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: [
                        "'self'",
                        "'unsafe-inline'",
                        'https://fonts.googleapis.com',
                    ],
                    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
                    imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
                    connectSrc: ["'self'"],
                    frameAncestors: ["'none'"],
                    upgradeInsecureRequests: [],
                },
            },
            crossOriginEmbedderPolicy: false, // Allow embedded content
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
            },
            xFrameOptions: { action: 'deny' },
            xContentTypeOptions: true,
            referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        }),
    );

    // Body parser limits to prevent DoS / Large Payload attacks
    app.use(json({ limit: '100kb' }));
    app.use(urlencoded({ extended: true, limit: '100kb' }));

    app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

    // Global Transform Interceptor - wraps all responses in ResponsePayloadDto
    app.useGlobalInterceptors(new TransformInterceptor());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Global API prefix
    app.setGlobalPrefix('api');

    // Version Control
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    // Hardened CORS — NEVER allow wildcard in any environment
    const allowedOrigins = envConfigService.getOrigins();
    app.enableCors({
        origin: (
            origin: string | undefined,
            callback: (err: Error | null, allow?: boolean) => void,
        ) => {
            // Allow requests with no origin (mobile apps, curl, server-to-server)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            callback(
                new Error(`CORS policy: Origin ${origin} not allowed`),
                false,
            );
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'token',
            'x-requested-with',
            'x-forwarded-for',
            'X-CSRF-Token',
            'X-Retry-CSRF',
        ],
        exposedHeaders: ['Authorization'],
    });

    app.use(cookieParser());

    if (!envConfigService.isProduction()) {
        const config = new DocumentBuilder()
            .setTitle('Cofixer API')
            .setDescription('Cofixer API Documentation')
            .setVersion('1.0')
            .addBearerAuth()
            .addCookieAuth('accessToken', {
                type: 'apiKey',
                in: 'cookie',
                name: process.env.AUTH_TOKEN_COOKIE_NAME || 'accessToken',
                description:
                    'Cookie-based authentication (automatically set after login)',
            })
            .addTag('App', 'Application endpoints')
            .addTag('Authentication', 'Authentication endpoints')
            .addTag('OTP', 'OTP management endpoints')
            .addTag('Users', 'User management endpoints')
            .addTag('Features', 'Feature management endpoints')
            .build();

        const document = SwaggerModule.createDocument(app, config, {
            operationIdFactory: (controllerKey: string, methodKey: string) =>
                methodKey,
        });

        // Ensure ResponsePayloadDto schema exists in components (fallback)
        const docAny = document as any;
        docAny.components = docAny.components || {};
        docAny.components.schemas = docAny.components.schemas || {};
        if (!docAny.components.schemas.ResponsePayloadDto) {
            docAny.components.schemas.ResponsePayloadDto = {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'number', example: 200 },
                    message: {
                        type: 'string',
                        example: 'Operation completed successfully',
                    },
                    data: { type: 'object' },
                    error: { type: 'array', items: { type: 'object' } },
                    timestamp: { type: 'string', format: 'date-time' },
                    path: { type: 'string' },
                },
            };
        }

        // For any operation: ensure at least one success response (200/201/204) has a ResponsePayloadDto schema.
        const successStatusCodes = ['200', '201', '204'];
        Object.keys(docAny.paths || {}).forEach((path) => {
            const methods = docAny.paths[path];
            Object.keys(methods).forEach((method) => {
                const op = methods[method];
                op.responses = op.responses || {};

                // First, if no success responses exist at all, add a default 200 with the schema
                const hasAnySuccess = successStatusCodes.some(
                    (s) => !!op.responses[s],
                );
                if (!hasAnySuccess) {
                    op.responses['200'] = {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ResponsePayloadDto',
                                },
                            },
                        },
                    };
                    return;
                }

                // If a success response exists but lacks a schema, inject the ResponsePayloadDto schema
                for (const status of successStatusCodes) {
                    const resp = op.responses[status];
                    if (!resp) continue;

                    const hasSchema = !!(
                        (resp.content &&
                            resp.content['application/json'] &&
                            resp.content['application/json'].schema) ||
                        resp.schema ||
                        resp.$ref
                    );

                    if (!hasSchema) {
                        // Replace or set the content to reference ResponsePayloadDto
                        op.responses[status].content = {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ResponsePayloadDto',
                                },
                            },
                        };
                        break;
                    }
                }
            });
        });

        SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                docExpansion: 'none',
                filter: true,
                showRequestDuration: true,
                syntaxHighlight: {
                    activate: true,
                    theme: 'monokai',
                },
                withCredentials: true,
            },
            customSiteTitle: 'Cofixer API',
        });
    }

    const port = envConfigService.getPort() || 3000;
    await app.listen(port);

    // Use logger in production, console.log in development
    const startupMessage = `Application is running on: http://localhost:${port}`;
    if (envConfigService.isProduction()) {
        instance.info(startupMessage);
        instance.info('Swagger documentation is disabled in production mode');
    } else {
        console.log(startupMessage);
        console.log(
            `Swagger documentation available at: http://localhost:${port}/docs`,
        );
    }
}

void bootstrap();
