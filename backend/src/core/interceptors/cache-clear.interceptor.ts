import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { RedisService } from '@infrastructure/cache';
import { CACHE_CLEAR_KEY } from '../decorators/cache-clear.decorator';

@Injectable()
export class CacheClearInterceptor implements NestInterceptor {
    private readonly logger = new Logger(CacheClearInterceptor.name);

    constructor(
        private readonly redisService: RedisService,
        private readonly reflector: Reflector,
    ) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const request = context.switchToHttp().getRequest<Request>();
        const method = request.method;

        const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
        if (!mutatingMethods.includes(method)) {
            return next.handle();
        }

        const tag = this.reflector.getAllAndOverride<string>(CACHE_CLEAR_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!tag) {
            return next.handle();
        }

        const pattern = `cache:${tag}:*`;

        return next.handle().pipe(
            tap({
                next: () => {
                    this.redisService
                        .delByPattern(pattern)
                        .then(() => {
                            this.logger.debug(`Cache cleared: ${pattern}`);
                        })
                        .catch(() => {
                            // Silently fail if Redis is down
                        });
                },
                error: () => {
                    this.redisService
                        .delByPattern(pattern)
                        .then(() => {
                            this.logger.debug(
                                `Cache cleared on error: ${pattern}`,
                            );
                        })
                        .catch(() => {
                            // Silently fail if Redis is down
                        });
                },
            }),
        );
    }
}
