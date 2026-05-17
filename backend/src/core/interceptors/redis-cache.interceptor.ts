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
import { CACHE_TAG_KEY } from '../decorators/cache-tag.decorator';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
    private readonly logger = new Logger(RedisCacheInterceptor.name);

    constructor(
        private readonly redisService: RedisService,
        private readonly reflector: Reflector,
    ) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const request = context.switchToHttp().getRequest<Request>();

        if (request.method !== 'GET') {
            return next.handle();
        }

        const tag = this.reflector.getAllAndOverride<string>(CACHE_TAG_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!tag) {
            return next.handle();
        }

        const cacheKey = `cofixer:cache:${tag}:${request.originalUrl}`;

        return new Observable((subscriber) => {
            this.redisService
                .get<unknown>(cacheKey)
                .then((cached) => {
                    if (cached !== null) {
                        this.logger.debug(`Cache HIT: ${cacheKey}`);
                        subscriber.next(cached);
                        subscriber.complete();
                        return;
                    }

                    this.logger.debug(`Cache MISS: ${cacheKey}`);
                    next.handle()
                        .pipe(
                            tap({
                                next: (data) => {
                                    this.redisService
                                        .set(cacheKey, data)
                                        .catch(() => {
                                            // Silently fail if Redis is down
                                        });
                                },
                            }),
                        )
                        .subscribe(subscriber);
                })
                .catch(() => {
                    next.handle().subscribe(subscriber);
                });
        });
    }
}
