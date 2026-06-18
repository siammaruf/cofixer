export class ChunkUploadDto {
    uploadId: string;
    chunkIndex: number;
    totalChunks: number;
}

export class ChunkCompleteDto {
    uploadId: string;
    originalName: string;
    mimeType: string;
    size: number;
    totalChunks: number;
}
