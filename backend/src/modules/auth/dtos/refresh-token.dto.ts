import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({
        example: 'eyJhbGciOiJSZWZyZXNoVG9rZW4...',
        description: 'Refresh token received during login',
    })
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}
