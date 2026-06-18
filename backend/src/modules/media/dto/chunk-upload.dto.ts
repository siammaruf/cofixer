import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ChunkUploadDto {
    @IsString()
    uploadId: string;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    chunkIndex: number;

    @IsNumber()
    @Min(1)
    @Type(() => Number)
    totalChunks: number;
}

export class ChunkCompleteDto {
    @IsString()
    uploadId: string;

    @IsString()
    originalName: string;

    @IsString()
    mimeType: string;

    @IsNumber()
    @Min(1)
    @Type(() => Number)
    size: number;

    @IsNumber()
    @Min(1)
    @Type(() => Number)
    totalChunks: number;
}
