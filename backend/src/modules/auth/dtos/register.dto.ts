import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'SecurePassword123!' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({ example: 'John', required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ example: 'Doe', required: false })
    @IsOptional()
    @IsString()
    lastName?: string;
}
