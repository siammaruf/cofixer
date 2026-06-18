import { IsString, IsNumber, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ChunkUploadDto {
    @IsString()
    @IsNotEmpty({ message: 'uploadId is required' })
    uploadId: string;

    @IsNumber()
    @Min(0, { message: 'chunkIndex must be at least 0' })
    @Type(() => Number)
    chunkIndex: number;

    @IsNumber()
    @Min(1, { message: 'totalChunks must be at least 1' })
    @Type(() => Number)
    totalChunks: number;
}

export class ChunkCompleteDto {
    @IsString()
    @IsNotEmpty({ message: 'uploadId is required' })
    uploadId: string;

    @IsString()
    @IsNotEmpty({ message: 'originalName is required' })
    originalName: string;

    @IsString()
    @IsNotEmpty({ message: 'mimeType is required' })
    mimeType: string;

    @IsNumber()
    @Min(0, { message: 'size must be 0 or greater' })
    @Type(() => Number)
    size: number;

    @IsNumber()
    @Min(1, { message: 'totalChunks must be at least 1' })
    @Type(() => Number)
    totalChunks: number;
}
