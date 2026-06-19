import {
    Injectable,
    Logger,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { envConfigService } from '../../config/env-config.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Media } from '../../modules/media/media.entity';
import { MediaUploadJobData } from './queue.service';

interface UploadStatus {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    result?: Media;
    error?: string;
}

@Injectable()
export class MediaUploadProcessor implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(MediaUploadProcessor.name);
    private worker: Worker;
    private redisConnection: Redis;
    private statusRedis: Redis;
    private readonly tempDir = path.resolve(process.cwd(), 'uploads', 'temp');
    private readonly redisPrefix: string;
    private readonly useUnsignedUpload: boolean;

    constructor(
        private readonly cloudinaryService: CloudinaryService,
        @InjectRepository(Media)
        private readonly mediaRepository: Repository<Media>,
    ) {
        this.redisPrefix =
            envConfigService.getValue('REDIS_PREFIX', false) || 'cofixer';
        this.useUnsignedUpload =
            !!envConfigService.getCloudinaryConfig().uploadPreset;
        if (this.useUnsignedUpload) {
            this.logger.log(
                'Cloudinary upload preset detected — using unsigned upload mode',
            );
        }
    }

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

        this.statusRedis = new Redis({
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db: redisConfig.db,
            maxRetriesPerRequest: 1,
        });

        this.worker = new Worker(
            'media-upload',
            async (job: Job<MediaUploadJobData>) => {
                await this.processJob(job);
            },
            { connection: this.redisConnection, concurrency: 2 },
        );

        this.worker.on('failed', (job, err) => {
            this.logger.error(
                `Job ${job?.id} failed permanently: ${err.message}`,
                err.stack,
            );
            // Clean up chunk files after all retries are exhausted
            if (job?.data?.uploadId) {
                this.cleanupAfterPermanentFailure(job.data.uploadId);
            }
        });

        this.logger.log('Media upload worker initialized');
    }

    onModuleDestroy() {
        this.worker?.close().catch(() => {});
        this.redisConnection?.disconnect();
        this.statusRedis?.disconnect();
    }

    private async processJob(job: Job<MediaUploadJobData>): Promise<Media> {
        const { uploadId, originalName, mimeType, size, totalChunks, folder } =
            job.data;
        const assembledFilePath = path.join(this.tempDir, `${uploadId}.tmp`);

        await this.setStatus(uploadId, { status: 'processing', progress: 10 });

        try {
            // Assemble chunks into a single temp file
            await this.assembleChunksToFile(
                uploadId,
                totalChunks,
                assembledFilePath,
            );
            await this.setStatus(uploadId, {
                status: 'processing',
                progress: 40,
            });

            // Upload to Cloudinary directly from file path (efficient for large files)
            const uploadResult = this.useUnsignedUpload
                ? await this.cloudinaryService.unsignedUploadFromPath(
                      assembledFilePath,
                      mimeType,
                      folder,
                  )
                : await this.cloudinaryService.uploadFromPath(
                      assembledFilePath,
                      mimeType,
                      folder,
                  );
            await this.setStatus(uploadId, {
                status: 'processing',
                progress: 80,
            });

            // Save to database
            const media = this.mediaRepository.create({
                filename: uploadResult.publicId,
                originalName,
                mimeType,
                size,
                url: uploadResult.url,
                thumbUrl: uploadResult.thumbUrl,
                largeUrl: uploadResult.largeUrl,
                fullUrl: uploadResult.fullUrl,
            });

            const savedMedia = await this.mediaRepository.save(media);
            await this.setStatus(uploadId, {
                status: 'completed',
                progress: 100,
                result: savedMedia,
            });

            // Clean up temp chunks and assembled file
            await this.cleanupChunks(uploadId, totalChunks);
            this.safeDeleteFile(assembledFilePath);

            this.logger.log(
                `Media upload completed: ${savedMedia.id} (${originalName})`,
            );
            return savedMedia;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Unknown error';
            await this.setStatus(uploadId, {
                status: 'failed',
                error: message,
            });
            // Only clean up assembled temp file; keep chunks for potential retries.
            // BullMQ will retry based on job options. Chunks are cleaned up by
            // a periodic temp-dir cleanup or after final failure.
            this.safeDeleteFile(assembledFilePath);
            throw error;
        }
    }

    private async assembleChunksToFile(
        uploadId: string,
        totalChunks: number,
        outputPath: string,
    ): Promise<void> {
        const writeStream = fs.createWriteStream(outputPath);
        const uploadDir = path.join(this.tempDir, uploadId);

        for (let i = 0; i < totalChunks; i++) {
            const chunkPath = path.join(uploadDir, `chunk-${i}`);
            if (!fs.existsSync(chunkPath)) {
                writeStream.destroy();
                let dirContents: string[] = [];
                try {
                    if (fs.existsSync(uploadDir)) {
                        dirContents = fs.readdirSync(uploadDir);
                    }
                } catch {
                    // ignore
                }
                this.logger.error(
                    `Missing chunk ${i} for upload ${uploadId}. Directory contents: [${dirContents.join(', ')}]`,
                );
                throw new Error(`Missing chunk ${i} for upload ${uploadId}`);
            }
            const chunk = fs.readFileSync(chunkPath);
            writeStream.write(chunk);
        }

        return new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
            writeStream.end();
        });
    }

    private async cleanupChunks(
        uploadId: string,
        totalChunks: number,
    ): Promise<void> {
        try {
            const uploadDir = path.join(this.tempDir, uploadId);
            if (fs.existsSync(uploadDir)) {
                fs.rmSync(uploadDir, { recursive: true, force: true });
            }
        } catch (err) {
            this.logger.warn(
                `Failed to cleanup chunks for ${uploadId}: ${err.message}`,
            );
        }
    }

    private safeDeleteFile(filePath: string): void {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (err) {
            this.logger.warn(
                `Failed to delete file ${filePath}: ${err.message}`,
            );
        }
    }

    private cleanupAfterPermanentFailure(uploadId: string): void {
        try {
            const uploadDir = path.join(this.tempDir, uploadId);
            const assembledFilePath = path.join(
                this.tempDir,
                `${uploadId}.tmp`,
            );
            if (fs.existsSync(uploadDir)) {
                fs.rmSync(uploadDir, { recursive: true, force: true });
            }
            this.safeDeleteFile(assembledFilePath);
            this.logger.log(
                `Cleaned up temp files for failed upload ${uploadId}`,
            );
        } catch (err) {
            this.logger.warn(
                `Failed to clean up after permanent failure for ${uploadId}: ${err.message}`,
            );
        }
    }

    async setStatus(uploadId: string, status: UploadStatus): Promise<void> {
        try {
            await this.statusRedis.setex(
                `${this.redisPrefix}:media-upload:${uploadId}:status`,
                3600,
                JSON.stringify(status),
            );
        } catch {
            // Silently fail
        }
    }

    async getStatus(uploadId: string): Promise<UploadStatus | null> {
        try {
            const value = await this.statusRedis.get(
                `${this.redisPrefix}:media-upload:${uploadId}:status`,
            );
            return value ? (JSON.parse(value) as UploadStatus) : null;
        } catch {
            return null;
        }
    }
}
