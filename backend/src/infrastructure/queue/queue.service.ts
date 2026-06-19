import {
    Injectable,
    Logger,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { envConfigService } from '../../config/env-config.service';

export interface MediaUploadJobData {
    uploadId: string;
    originalName: string;
    mimeType: string;
    size: number;
    totalChunks: number;
    folder?: string;
}

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(QueueService.name);
    private mediaUploadQueue: Queue;
    private redisConnection: Redis;

    onModuleInit() {
        const redisConfig = envConfigService.getRedisConfig();
        this.redisConnection = new Redis({
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db: redisConfig.db,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        });

        this.mediaUploadQueue = new Queue('media-upload', {
            connection: this.redisConnection,
        });
        this.logger.log('Media upload queue initialized');
    }

    onModuleDestroy() {
        this.mediaUploadQueue?.close().catch(() => {});
        this.redisConnection?.disconnect();
    }

    async addMediaUploadJob(data: MediaUploadJobData) {
        return this.mediaUploadQueue.add('process-upload', data, {
            jobId: data.uploadId,
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: { count: 100 },
            removeOnFail: { count: 50 },
        });
    }

    getMediaUploadQueue(): Queue {
        return this.mediaUploadQueue;
    }
}
