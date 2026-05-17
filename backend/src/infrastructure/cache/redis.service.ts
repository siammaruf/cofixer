import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly redis: Redis;
    private readonly logger = new Logger(RedisService.name);
    private readonly defaultTtl: number;
    private isConnected = false;

    constructor(private readonly configService: ConfigService) {
        const host = this.configService.get<string>('REDIS_HOST', 'localhost');
        const port = this.configService.get<number>('REDIS_PORT', 6379);
        const password = this.configService.get<string>('REDIS_PASSWORD');
        const db = this.configService.get<number>('REDIS_DB', 0);
        this.defaultTtl = this.configService.get<number>(
            'REDIS_CACHE_TTL',
            3600,
        );

        this.redis = new Redis({
            host,
            port,
            password: password || undefined,
            db,
            retryStrategy: (times) => {
                if (times > 3) {
                    this.logger.error(
                        'Redis connection failed after 3 retries. Running without cache.',
                    );
                    return null;
                }
                return Math.min(times * 100, 3000);
            },
            maxRetriesPerRequest: 1,
            lazyConnect: true,
        });

        this.redis
            .connect()
            .then(() => {
                this.isConnected = true;
                this.logger.log('Redis connected successfully');
            })
            .catch((err) => {
                this.isConnected = false;
                this.logger.error(`Redis connection error: ${err.message}`);
            });

        this.redis.on('error', (err) => {
            this.isConnected = false;
            this.logger.error(`Redis error: ${err.message}`);
        });

        this.redis.on('connect', () => {
            this.isConnected = true;
        });
    }

    async get<T>(key: string): Promise<T | null> {
        if (!this.isConnected) return null;
        try {
            const value = await this.redis.get(key);
            return value ? (JSON.parse(value) as T) : null;
        } catch {
            return null;
        }
    }

    async set(key: string, value: unknown, ttl?: number): Promise<void> {
        if (!this.isConnected) return;
        try {
            const seconds = ttl ?? this.defaultTtl;
            await this.redis.setex(key, seconds, JSON.stringify(value));
        } catch {
            // Silently fail
        }
    }

    async del(key: string): Promise<void> {
        if (!this.isConnected) return;
        try {
            await this.redis.del(key);
        } catch {
            // Silently fail
        }
    }

    async delByPattern(pattern: string): Promise<void> {
        if (!this.isConnected) return;
        try {
            const stream = this.redis.scanStream({
                match: pattern,
                count: 100,
            });

            const pipeline = this.redis.pipeline();
            let keyCount = 0;

            stream.on('data', (keys: string[]) => {
                if (keys.length) {
                    keys.forEach((key) => {
                        pipeline.del(key);
                        keyCount++;
                    });
                }
            });

            await new Promise<void>((resolve, reject) => {
                stream.on('end', () => {
                    if (keyCount > 0) {
                        pipeline
                            .exec()
                            .then(() => resolve())
                            .catch(reject);
                    } else {
                        resolve();
                    }
                });
                stream.on('error', reject);
            });
        } catch {
            // Silently fail
        }
    }

    getClient(): Redis {
        return this.redis;
    }

    isReady(): boolean {
        return this.isConnected;
    }

    onModuleDestroy() {
        this.redis.disconnect();
    }
}
