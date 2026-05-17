import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
    @ApiProperty({ example: 'example@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '1234',
        description: 'OTP code received via email',
    })
    @IsNotEmpty()
    @IsString()
    otp: string;
}
