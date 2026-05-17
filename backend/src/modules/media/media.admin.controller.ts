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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { CacheClear } from '../../core/decorators/cache-clear.decorator';
import { CacheClearInterceptor } from '../../core/interceptors/cache-clear.interceptor';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { RolesEnum } from '../../shared/enums/role.enum';
import {
    CreatedResponseDto,
    DeletedResponseDto,
} from '../../shared/dtos/response.dto';
import { CloudinaryService } from '../../infrastructure/cloudinary';
import { MediaService } from './media.service';
import { Media } from './media.entity';

@ApiTags('Admin - Media')
@Controller('admin/media')
@UseGuards(RolesGuard)
@UseInterceptors(CacheClearInterceptor)
export class MediaAdminController {
    constructor(
        private readonly mediaService: MediaService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    @Post('upload')
    @CacheClear('media')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            fileFilter: (req, file, cb) => {
                if (
                    file.mimetype.match(
                        /\/(jpg|jpeg|png|gif|webp|svg|pdf|doc|docx|mp4|mov|webm)$/,
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
            limits: { fileSize: 10 * 1024 * 1024 },
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
