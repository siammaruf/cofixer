import { Injectable, Logger } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
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

    private isImage(mimeType: string): boolean {
        return mimeType.startsWith('image/');
    }

    async uploadFile(
        file: Express.Multer.File,
        folder?: string,
    ): Promise<CloudinaryUploadResult> {
        const isImage = this.isImage(file.mimetype);
        const eager = isImage
            ? [
                  {
                      width: 150,
                      height: 150,
                      crop: 'fill',
                      quality: 'auto:best',
                      fetch_format: 'auto',
                  },
                  {
                      width: 1200,
                      crop: 'limit',
                      quality: 'auto:best',
                      fetch_format: 'auto',
                  },
                  {
                      quality: 'auto:best',
                      fetch_format: 'auto',
                  },
              ]
            : undefined;

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder || this.folder,
                    resource_type: 'auto',
                    use_filename: true,
                    unique_filename: true,
                    eager,
                },
                (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                    if (error) {
                        this.logger.error(
                            `Cloudinary upload failed: ${error.message}`,
                        );
                        reject(new Error(error.message));
                        return;
                    }

                    const eagerResults = result.eager || [];
                    resolve({
                        publicId: result.public_id,
                        url: result.secure_url,
                        thumbUrl: eagerResults[0]?.secure_url,
                        largeUrl: eagerResults[1]?.secure_url,
                        fullUrl: eagerResults[2]?.secure_url,
                    });
                },
            );
            uploadStream.end(file.buffer);
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
