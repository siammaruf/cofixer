import { Injectable, Logger } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as fs from 'fs';
import { cloudinary } from '../../config/cloudinary.config';
import { envConfigService } from '../../config/env-config.service';

export interface CloudinaryUploadResult {
    publicId: string;
    url: string;
    thumbUrl?: string;
    largeUrl?: string;
    fullUrl?: string;
}

@Injectable()
export class CloudinaryService {
    private readonly logger = new Logger(CloudinaryService.name);
    private readonly folder = envConfigService.getCloudinaryConfig().folder;
    private readonly uploadPreset = envConfigService.getCloudinaryConfig().uploadPreset;

    constructor() {
        const cfg = envConfigService.getCloudinaryConfig();
        if (!cfg.apiSecret || cfg.apiSecret.length < 10) {
            throw new Error(
                `Cloudinary API Secret is missing or invalid (length=${cfg.apiSecret?.length || 0}). ` +
                `Make sure CLOUDINARY_API_SECRET is set in backend/.env and the server was restarted.`
            );
        }
    }

    private isImage(mimeType: string): boolean {
        return mimeType.startsWith('image/');
    }

    private isVideo(mimeType: string): boolean {
        return mimeType.startsWith('video/');
    }

    private getImageEager() {
        // SEO-optimized WebP variants for images
        return [
            {
                width: 150,
                height: 150,
                crop: 'fill',
                quality: 'auto:good',
                fetch_format: 'webp',
            },
            {
                width: 1200,
                crop: 'limit',
                quality: 'auto:good',
                fetch_format: 'webp',
            },
            {
                quality: 'auto:good',
                fetch_format: 'webp',
            },
        ];
    }

    private getVideoEager() {
        // SEO-optimized WebM variant for videos (smaller size, modern format)
        return [
            {
                format: 'webm',
                video_codec: 'vp9',
                quality: 'auto:good',
                audio_codec: 'opus',
            },
        ];
    }

    private buildUploadOptions(
        mimeType: string,
        folder?: string,
    ): Record<string, unknown> {
        const isImage = this.isImage(mimeType);
        const isVideo = this.isVideo(mimeType);
        const eager = isImage
            ? this.getImageEager()
            : isVideo
                ? this.getVideoEager()
                : undefined;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const baseFolder = folder || this.folder;

        return {
            folder: `${baseFolder}/${year}/${month}`,
            resource_type: isVideo ? 'video' : 'auto',
            use_filename: true,
            unique_filename: true,
            eager,
        };
    }

    private handleUploadResult(result: UploadApiResponse): CloudinaryUploadResult {
        const eagerResults = result.eager || [];
        return {
            publicId: result.public_id,
            url: result.secure_url,
            thumbUrl: eagerResults[0]?.secure_url,
            largeUrl: eagerResults[1]?.secure_url,
            fullUrl: eagerResults[2]?.secure_url,
        };
    }

    /**
     * Signed upload from a file path (recommended for server-side chunked assembly).
     * Uses CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET — no preset required.
     */
    async uploadFromPath(
        filePath: string,
        mimeType: string,
        folder?: string,
    ): Promise<CloudinaryUploadResult> {
        const cfg = envConfigService.getCloudinaryConfig();
        const options = {
            ...this.buildUploadOptions(mimeType, folder),
            cloud_name: cfg.cloudName,
            api_key: cfg.apiKey,
            api_secret: cfg.apiSecret,
        };

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                filePath,
                options,
                (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                    if (error) {
                        this.logger.error(
                            `Cloudinary upload failed: ${error.message}`,
                        );
                        reject(new Error(error.message));
                        return;
                    }
                    resolve(this.handleUploadResult(result));
                },
            );
        });
    }

    /**
     * Signed upload from a Buffer (recommended for direct Multer file uploads).
     * Uses CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET — no preset required.
     */
    async uploadBuffer(
        buffer: Buffer,
        originalName: string,
        mimeType: string,
        folder?: string,
    ): Promise<CloudinaryUploadResult> {
        const cfg = envConfigService.getCloudinaryConfig();
        const options = {
            ...this.buildUploadOptions(mimeType, folder),
            cloud_name: cfg.cloudName,
            api_key: cfg.apiKey,
            api_secret: cfg.apiSecret,
        };

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                options,
                (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                    if (error) {
                        this.logger.error(
                            `Cloudinary upload failed: ${error.message}`,
                        );
                        reject(new Error(error.message));
                        return;
                    }
                    resolve(this.handleUploadResult(result));
                },
            );
            stream.end(buffer);
        });
    }

    async uploadFile(
        file: Express.Multer.File,
        folder?: string,
    ): Promise<CloudinaryUploadResult> {
        return this.uploadBuffer(file.buffer, file.originalname, file.mimetype, folder);
    }

    /**
     * Unsigned upload from a Buffer — uses CLOUDINARY_UPLOAD_PRESET from env by default.
     */
    async unsignedUploadBuffer(
        buffer: Buffer,
        mimeType: string,
        folder?: string,
        uploadPreset: string = this.uploadPreset,
    ): Promise<CloudinaryUploadResult> {
        if (!uploadPreset) {
            throw new Error(
                'Upload preset is required for unsigned upload. ' +
                'Set CLOUDINARY_UPLOAD_PRESET in .env or pass it explicitly.',
            );
        }

        const options = {
            ...this.buildUploadOptions(mimeType, folder),
            upload_preset: uploadPreset,
        };

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.unsigned_upload_stream(
                uploadPreset,
                (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                    if (error) {
                        this.logger.error(
                            `Cloudinary unsigned upload failed: ${error.message}`,
                        );
                        reject(new Error(error.message));
                        return;
                    }
                    resolve(this.handleUploadResult(result));
                },
                options,
            );
            stream.end(buffer);
        });
    }

    async unsignedUploadFile(
        file: Express.Multer.File,
        folder?: string,
        uploadPreset: string = this.uploadPreset,
    ): Promise<CloudinaryUploadResult> {
        return this.unsignedUploadBuffer(
            file.buffer,
            file.mimetype,
            folder,
            uploadPreset,
        );
    }

    /**
     * Unsigned upload from a file path — streams the file to Cloudinary.
     * Uses CLOUDINARY_UPLOAD_PRESET from env by default.
     */
    async unsignedUploadFromPath(
        filePath: string,
        mimeType: string,
        folder?: string,
        uploadPreset: string = this.uploadPreset,
    ): Promise<CloudinaryUploadResult> {
        if (!uploadPreset) {
            throw new Error(
                'Upload preset is required for unsigned upload. ' +
                'Set CLOUDINARY_UPLOAD_PRESET in .env or pass it explicitly.',
            );
        }

        const options = {
            ...this.buildUploadOptions(mimeType, folder),
            upload_preset: uploadPreset,
        };

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.unsigned_upload_stream(
                uploadPreset,
                (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                    if (error) {
                        this.logger.error(
                            `Cloudinary unsigned upload failed: ${error.message}`,
                        );
                        reject(new Error(error.message));
                        return;
                    }
                    resolve(this.handleUploadResult(result));
                },
                options,
            );

            const readStream = fs.createReadStream(filePath);
            readStream.on('error', (err) => reject(err));
            readStream.pipe(stream);
        });
    }

    /**
     * Create or update an unsigned upload preset programmatically.
     * Run this once during setup or in an admin/seeder script.
     */
    async createUploadPreset(
        presetName: string,
        options: {
            folder?: string;
            resourceType?: 'image' | 'video' | 'raw' | 'auto';
            eager?: Array<Record<string, unknown>>;
            eagerAsync?: boolean;
            unsigned?: boolean;
        } = {},
    ): Promise<{ message: string; preset: unknown }> {
        const {
            folder = this.folder,
            resourceType = 'auto',
            eager,
            eagerAsync = true,
            unsigned = true,
        } = options;

        try {
            const preset = await cloudinary.api.create_upload_preset({
                name: presetName,
                folder,
                resource_type: resourceType,
                unsigned,
                ...(eager ? { eager } : {}),
                ...(eager ? { eager_async: eagerAsync } : {}),
                overwrite: true,
            });

            this.logger.log(`Upload preset created/updated: ${presetName}`);
            return { message: 'Preset created successfully', preset };
        } catch (error) {
            this.logger.error(
                `Failed to create upload preset ${presetName}: ${error.message}`,
            );
            throw error;
        }
    }

    /**
     * Create the default video preset with multiple format variants.
     * Call this in a setup script or admin command.
     */
    async createDefaultVideoPreset(): Promise<{ message: string; preset: unknown }> {
        return this.createUploadPreset('cofixer_video_preset', {
            folder: `${this.folder}/videos`,
            resourceType: 'video',
            unsigned: true,
            eager: [
                {
                    format: 'webm',
                    video_codec: 'vp9',
                    audio_codec: 'opus',
                    quality: 'auto:good',
                },
                {
                    format: 'mp4',
                    video_codec: 'av1',
                    audio_codec: 'aac',
                    quality: 'auto:good',
                },
                {
                    format: 'mp4',
                    video_codec: 'h265',
                    audio_codec: 'aac',
                    quality: 'auto:good',
                },
                {
                    format: 'mp4',
                    video_codec: 'h264',
                    audio_codec: 'aac',
                    quality: 'auto:good',
                },
            ],
            eagerAsync: true,
        });
    }

    async deleteFile(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
            this.logger.log(`Cloudinary file deleted: ${publicId}`);
        } catch (error) {
            this.logger.error(
                `Cloudinary delete failed for ${publicId}: ${error.message}`,
            );
            throw error;
        }
    }

    extractPublicId(url: string): string | null {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const uploadIndex = pathParts.indexOf('upload');
            if (uploadIndex === -1) return null;
            const publicIdParts = pathParts.slice(uploadIndex + 2);
            const publicIdWithExt = publicIdParts.join('/');
            const lastDotIndex = publicIdWithExt.lastIndexOf('.');
            return lastDotIndex > -1
                ? publicIdWithExt.slice(0, lastDotIndex)
                : publicIdWithExt;
        } catch {
            return null;
        }
    }
}
