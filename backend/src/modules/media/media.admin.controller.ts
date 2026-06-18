import {
    Controller,
    Post,
    Delete,
    Param,
    HttpCode,
    HttpStatus,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    ParseUUIDPipe,
    Body,
    BadRequestException,
    Get,
    Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { CacheClear } from '../../core/decorators/cache-clear.decorator';
import { CacheClearInterceptor } from '../../core/interceptors/cache-clear.interceptor';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { RolesEnum } from '../../shared/enums/role.enum';
import {
    CreatedResponseDto,
    DeletedResponseDto,
    SuccessResponseDto,
} from '../../shared/dtos/response.dto';
import { CloudinaryService } from '../../infrastructure/cloudinary';
import { QueueService } from '../../infrastructure/queue/queue.service';
import { MediaUploadProcessor } from '../../infrastructure/queue/media-upload.processor';
import { MediaService } from './media.service';
import { Media } from './media.entity';
import { ChunkUploadDto, ChunkCompleteDto } from './dto/chunk-upload.dto';

@ApiTags('Admin - Media')
@Controller('admin/media')
@UseGuards(RolesGuard)
@UseInterceptors(CacheClearInterceptor)
export class MediaAdminController {
    private readonly logger = new Logger(MediaAdminController.name);
    private readonly tempDir = path.resolve(process.cwd(), 'uploads', 'temp');

    constructor(
        private readonly mediaService: MediaService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly queueService: QueueService,
        private readonly mediaUploadProcessor: MediaUploadProcessor,
    ) {}

    private countChunksOnDisk(uploadId: string): number {
        const uploadDir = path.join(this.tempDir, uploadId);
        if (!fs.existsSync(uploadDir)) {
            return 0;
        }
        return fs
            .readdirSync(uploadDir)
            .filter((f) => f.startsWith('chunk-')).length;
    }

    @Post('upload')
    @CacheClear('media')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            fileFilter: (req, file, cb) => {
                if (
                    file.mimetype.match(
                        /\/(jpg|jpeg|png|gif|webp|svg|pdf|doc|docx|mp4|mov|webm|avi|mkv)$/,
                    )
                ) {
                    cb(null, true);
                } else {
                    cb(
                        new Error(
                            'Only image, video, document files are allowed',
                        ),
                        false,
                    );
                }
            },
            limits: { fileSize: 50 * 1024 * 1024 },
        }),
    )
    @HttpCode(HttpStatus.CREATED)
    @ApiSwagger({
        resourceName: 'Media',
        operation: 'create',
        requiresAuth: true,
    })
    async upload(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<CreatedResponseDto<Media>> {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        const media = await this.mediaService.create({
            filename: uploadResult.publicId,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: uploadResult.url,
            thumbUrl: uploadResult.thumbUrl,
            largeUrl: uploadResult.largeUrl,
            fullUrl: uploadResult.fullUrl,
        });
        return new CreatedResponseDto(media, 'Media uploaded successfully');
    }

    @Post('chunk')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            limits: { fileSize: 2 * 1024 * 1024 }, // 2MB per chunk
        }),
    )
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Media',
        operation: 'create',
        requiresAuth: true,
    })
    async uploadChunk(
        @Body() dto: ChunkUploadDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<SuccessResponseDto<{ received: number; total: number }>> {
        if (!dto.uploadId) {
            throw new BadRequestException('uploadId is required');
        }
        if (dto.chunkIndex === undefined || dto.totalChunks === undefined) {
            throw new BadRequestException('chunkIndex and totalChunks are required');
        }
        if (!file) {
            throw new BadRequestException('Chunk file is required');
        }

        const uploadDir = path.join(this.tempDir, dto.uploadId);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const chunkPath = path.join(uploadDir, `chunk-${dto.chunkIndex}`);
        fs.writeFileSync(chunkPath, file.buffer);

        return new SuccessResponseDto(
            { received: dto.chunkIndex + 1, total: dto.totalChunks },
            'Chunk received',
        );
    }

    @Post('chunk/complete')
    @CacheClear('media')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiSwagger({
        resourceName: 'Media',
        operation: 'create',
        requiresAuth: true,
    })
    async completeChunkUpload(
        @Body() dto: ChunkCompleteDto,
    ): Promise<SuccessResponseDto<{ uploadId: string; status: string }>> {
        // Debug: log what the server received
        this.logger.debug(
            `chunk/complete received: uploadId=${dto.uploadId}, size=${dto.size}, totalChunks=${dto.totalChunks}, mimeType=${dto.mimeType}`,
        );

        if (!dto.uploadId) {
            throw new BadRequestException('uploadId is required');
        }

        // Verify upload session exists
        const uploadDir = path.join(this.tempDir, dto.uploadId);
        if (!fs.existsSync(uploadDir)) {
            throw new BadRequestException('Upload session not found');
        }

        // Use server-side chunk count as source of truth
        const actualChunks = this.countChunksOnDisk(dto.uploadId);
        if (actualChunks === 0) {
            throw new BadRequestException(
                'No chunks found for this upload. Please upload chunks first.',
            );
        }

        // Warn if client-reported count differs from actual
        if (dto.totalChunks && dto.totalChunks !== actualChunks) {
            this.logger.warn(
                `Chunk count mismatch for ${dto.uploadId}: client reported ${dto.totalChunks}, actual on disk: ${actualChunks}. Using actual count.`,
            );
        }

        const totalChunks = actualChunks;

        // Add to queue for processing
        await this.queueService.addMediaUploadJob({
            uploadId: dto.uploadId,
            originalName: dto.originalName,
            mimeType: dto.mimeType,
            size: dto.size,
            totalChunks,
        });

        // Set initial status
        await this.mediaUploadProcessor.setStatus(dto.uploadId, {
            status: 'pending',
            progress: 0,
        });

        return new SuccessResponseDto(
            { uploadId: dto.uploadId, status: 'queued' },
            'Upload queued for processing',
        );
    }

    @Get('chunk/:uploadId/status')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Media',
        operation: 'getOne',
        requiresAuth: true,
    })
    async getChunkStatus(
        @Param('uploadId') uploadId: string,
    ): Promise<SuccessResponseDto<unknown>> {
        const status = await this.mediaUploadProcessor.getStatus(uploadId);
        if (!status) {
            throw new BadRequestException('Upload session not found');
        }
        return new SuccessResponseDto(status, 'Upload status retrieved');
    }

    @Delete(':id')
    @CacheClear('media')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Media',
        operation: 'delete',
        requiresAuth: true,
    })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<DeletedResponseDto> {
        await this.mediaService.remove(id);
        return new DeletedResponseDto('Media deleted successfully');
    }
}
