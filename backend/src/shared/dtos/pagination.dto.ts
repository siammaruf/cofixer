import { IsOptional, IsInt, Min, Max, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    @Type(() => String)
    sortBy?: string;

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    @Type(() => String)
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
