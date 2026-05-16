import { Controller, Post, Delete, Param, HttpCode, HttpStatus, UseGuards, UseInterceptors, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { RolesEnum } from '../../shared/enums/role.enum';
import { CreatedResponseDto, DeletedResponseDto } from '../../shared/dtos/response.dto';
import { MediaService } from './media.service';
import { Media } from './media.entity';

@ApiTags('Admin - Media')
@Controller('admin/media')
@UseGuards(RolesGuard)
export class MediaAdminController {
    constructor(private readonly mediaService: MediaService) {}

    @Post('upload')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + extname(file.originalname));
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/ (jpg|jpeg|png|gif|webp|svg)$/)) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed'), false);
            }
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    }))
    @HttpCode(HttpStatus.CREATED)
    @ApiSwagger({ resourceName: 'Media', operation: 'create', requiresAuth: true })
    async upload(@UploadedFile() file: Express.Multer.File): Promise<CreatedResponseDto<Media>> {
        const media = await this.mediaService.create({
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`,
        } as any);
        return new CreatedResponseDto(media, 'Media uploaded successfully');
    }

    @Delete(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'Media', operation: 'delete', requiresAuth: true })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeletedResponseDto> {
        await this.mediaService.remove(id);
        return new DeletedResponseDto('Media deleted successfully');
    }
}
