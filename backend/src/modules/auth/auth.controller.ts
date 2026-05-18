import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Req,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
    Version,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { randomBytes } from 'crypto';
import { LoginResponsePayloadDto, ResponsePayloadDto } from 'src/shared/dtos';
import { AuthService } from './auth.service';
import {
    ChangePasswordDto,
    ForgotPasswordDto,
    ForgotPasswordResponseDto,
    LoginDto,
    RefreshTokenDto,
    RegisterDto,
    RegisterFcmTokenDto,
    ResetPasswordDto,
    SocialLoginDto,
    VerifyOtpDto,
} from './dtos';
import { ChangeUserPasswordDto } from './dtos/change-user-password.dto';
import { ApiSwagger, CurrentUser, Public } from '@core/decorators';
import * as interfaces from '@shared/interfaces';
import { JwtAuthGuard } from '@core/guards';
import { RemoveToken, SetToken } from '@core/interceptors';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Version(['1', VERSION_NEUTRAL])
    @Post('login')
    @Public()
    @UseInterceptors(SetToken)
    @ApiSwagger({
        resourceName: 'Login',
        operation: 'custom',
        summary: 'User login',
        successStatus: 201,
        responseDto: LoginResponsePayloadDto,
        requiresAuth: false,
        errors: [
            { status: 400, description: 'Invalid credentials' },
            {
                status: 401,
                description: 'Unauthorized - incorrect email or password',
            },
            { status: 404, description: 'User not found' },
        ],
    })
    async login(
        @Body() dto: LoginDto,
    ): Promise<ResponsePayloadDto<LoginResponsePayloadDto>> {
        return await this.authService.login(dto);
    }

    @Version(['1', VERSION_NEUTRAL])
    @Post('admin-login')
    @Public()
    @UsePipes(ValidationPipe)
    @UseInterceptors(SetToken)
    @ApiSwagger({
        resourceName: 'Admin Login',
        operation: 'custom',
        summary: 'Admin login',
        requestDto: LoginDto,
        responseDto: LoginResponsePayloadDto,
        requiresAuth: false,
        errors: [
            { status: 400, description: 'Invalid credentials' },
            {
                status: 401,
                description: 'Unauthorized - incorrect email or password',
            },
            { status: 403, description: 'Forbidden - not an admin user' },
            { status: 404, description: 'User not found' },
        ],
    })
    async adminLogin(
        @Body() dto: LoginDto,
    ): Promise<ResponsePayloadDto<LoginResponsePayloadDto>> {
        return await this.authService.adminLogin(dto);
    }

    @Version(['1', VERSION_NEUTRAL])
    @Post('social-login')
    @Public()
    @UsePipes(ValidationPipe)
    @UseInterceptors(SetToken)
    @ApiSwagger({
        resourceName: 'Social Login',
        operation: 'custom',
        summary: 'Social login (Google)',
        requestDto: SocialLoginDto,
        responseDto: LoginResponsePayloadDto,
        requiresAuth: false,
        errors: [
            {
                status: 400,
                description: 'Invalid token or missing required fields',
            },
            { status: 401, description: 'Token verification failed' },
        ],
    })
    async socialLogin(
        @Body() dto: SocialLoginDto,
    ): Promise<LoginResponsePayloadDto> {
        return await this.authService.socialLogin(dto);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiSwagger({
        resourceName: 'Change Password',
        operation: 'custom',
        summary: 'Change password',
        requestDto: ChangePasswordDto,
        responseDto: LoginResponsePayloadDto,
        requiresAuth: true,
        errors: [
            {
                status: 400,
                description:
                    'Invalid old password or new password does not match confirmation',
            },
            {
                status: 401,
                description: 'Unauthorized - incorrect old password',
            },
            { status: 404, description: 'User not found' },
            { status: 500, description: 'Failed to update password' },
        ],
    })
    async changePassword(
        @CurrentUser() user: interfaces.IJwtPayload,
        @Body() dto: ChangePasswordDto,
    ): Promise<LoginResponsePayloadDto> {
        return await this.authService.changePassword(user, dto);
    }

    @Post('change-user-password')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard)
    @ApiSwagger({
        resourceName: 'Change User Password',
        operation: 'custom',
        summary: 'Change user password (admin)',
        requestDto: ChangeUserPasswordDto,
        responseDto: LoginResponsePayloadDto,
        requiresAuth: true,
        errors: [
            {
                status: 400,
                description: 'Password confirmation does not match',
            },
            { status: 401, description: 'Unauthorized' },
            { status: 404, description: 'User not found' },
            { status: 500, description: 'Failed to update password' },
        ],
    })
    async changeUserPassword(
        @CurrentUser() user: interfaces.IJwtPayload,
        @Body() dto: ChangeUserPasswordDto,
    ): Promise<LoginResponsePayloadDto> {
        return await this.authService.changeUserPassword(user, dto);
    }

    @Post('forgot-password')
    @Public()
    @UsePipes(ValidationPipe)
    @ApiSwagger({
        resourceName: 'Forgot Password',
        operation: 'custom',
        summary: 'Request password reset OTP',
        requestDto: ForgotPasswordDto,
        responseDto: ForgotPasswordResponseDto,
        requiresAuth: false,
        errors: [
            { status: 404, description: 'User not found' },
            {
                status: 429,
                description: 'Too many requests - please try again later',
            },
        ],
    })
    async forgotPassword(
        @Body() dto: ForgotPasswordDto,
    ): Promise<ForgotPasswordResponseDto> {
        return await this.authService.forgotPassword(dto);
    }

    @Post('reset-password')
    @Public()
    @UsePipes(ValidationPipe)
    @ApiSwagger({
        resourceName: 'Reset Password',
        operation: 'custom',
        summary: 'Reset password with OTP',
        requestDto: ResetPasswordDto,
        responseDto: LoginResponsePayloadDto,
        requiresAuth: false,
        errors: [
            {
                status: 400,
                description: 'Invalid OTP or password confirmation mismatch',
            },
            { status: 404, description: 'User not found' },
            { status: 500, description: 'Failed to update password' },
        ],
    })
    async resetPassword(
        @Body() dto: ResetPasswordDto,
    ): Promise<LoginResponsePayloadDto> {
        return await this.authService.resetPassword(dto);
    }

    @Post('verify-otp')
    @Public()
    @UsePipes(ValidationPipe)
    @ApiSwagger({
        resourceName: 'Verify OTP',
        operation: 'custom',
        summary: 'Verify OTP code for password reset',
        requestDto: VerifyOtpDto,
        responseDto: LoginResponsePayloadDto,
        requiresAuth: false,
        errors: [
            { status: 400, description: 'Invalid or expired OTP' },
            { status: 404, description: 'OTP not found' },
        ],
    })
    async verifyOtp(
        @Body() dto: VerifyOtpDto,
    ): Promise<ResponsePayloadDto<{ valid: boolean }>> {
        const result = await this.authService.verifyOtp(dto.email, dto.otp);
        return new ResponsePayloadDto({
            success: true,
            statusCode: 200,
            message: 'OTP verified successfully',
            data: result,
            timestamp: new Date().toISOString(),
        });
    }

    @Post('register')
    @Public()
    @UsePipes(ValidationPipe)
    @HttpCode(HttpStatus.CREATED)
    @ApiSwagger({
        resourceName: 'Register',
        operation: 'custom',
        summary: 'Register new user with email verification OTP',
        requestDto: RegisterDto,
        responseDto: LoginResponsePayloadDto,
        requiresAuth: false,
        errors: [
            { status: 400, description: 'Invalid input data' },
            { status: 409, description: 'User with this email already exists' },
        ],
    })
    async register(
        @Body() dto: RegisterDto,
    ): Promise<ResponsePayloadDto<{ email: string; expiresAt: Date }>> {
        return await this.authService.register(dto);
    }

    @Post('verify-email')
    @Public()
    @UsePipes(ValidationPipe)
    @UseInterceptors(SetToken)
    @ApiSwagger({
        resourceName: 'Verify Email',
        operation: 'custom',
        summary: 'Verify email with OTP and activate account',
        requestDto: VerifyOtpDto,
        responseDto: LoginResponsePayloadDto,
        requiresAuth: false,
        errors: [
            { status: 400, description: 'Invalid or expired OTP' },
            { status: 404, description: 'User not found' },
        ],
    })
    async verifyEmail(
        @Body() dto: VerifyOtpDto,
    ): Promise<LoginResponsePayloadDto> {
        return await this.authService.verifyEmail(dto.email, dto.otp);
    }

    @Post('refresh')
    @Public()
    @UsePipes(ValidationPipe)
    @UseInterceptors(SetToken)
    @ApiSwagger({
        resourceName: 'Refresh Token',
        operation: 'custom',
        summary: 'Refresh access token using refresh token',
        requestDto: RefreshTokenDto,
        responseDto: LoginResponsePayloadDto,
        requiresAuth: false,
        errors: [
            {
                status: 401,
                description: 'Unauthorized - invalid or expired refresh token',
            },
            { status: 404, description: 'User not found' },
            { status: 500, description: 'Failed to generate new token' },
        ],
    })
    async refreshToken(
        @Body() dto: RefreshTokenDto,
        @Req() req: any,
    ): Promise<LoginResponsePayloadDto> {
        const refreshToken =
            dto.refreshToken || req.cookies?.['StarterRefreshToken'];
        if (!refreshToken) {
            return {
                success: false,
                message: 'Refresh token is required',
            } as LoginResponsePayloadDto;
        }
        return await this.authService.refreshAccessToken(refreshToken);
    }

    @Version(['1', VERSION_NEUTRAL])
    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiSwagger({
        resourceName: 'Get Current User',
        operation: 'custom',
        summary: 'Get current authenticated user',
        responseDto: LoginResponsePayloadDto,
        requiresAuth: true,
        errors: [
            { status: 401, description: 'Unauthorized - invalid or missing token' },
            { status: 404, description: 'User not found' },
        ],
    })
    async getCurrentUser(
        @CurrentUser() user: interfaces.IJwtPayload,
    ): Promise<ResponsePayloadDto<interfaces.IJwtPayload>> {
        return await this.authService.getUserInformation(user);
    }

    @Version(['1', VERSION_NEUTRAL])
    @Get('csrf-token')
    @Public()
    @ApiSwagger({
        resourceName: 'CSRF Token',
        operation: 'custom',
        summary: 'Get CSRF token for mutating requests',
        requiresAuth: false,
    })
    getCsrfToken(): ResponsePayloadDto<{ token: string }> {
        const token = randomBytes(32).toString('hex');
        return new ResponsePayloadDto({
            success: true,
            statusCode: 200,
            message: 'CSRF token generated',
            data: { token },
            timestamp: new Date().toISOString(),
        });
    }

    @Version(['1', VERSION_NEUTRAL])
    @Get('check-login')
    @UseGuards(JwtAuthGuard)
    @ApiSwagger({
        resourceName: 'Check Login',
        operation: 'custom',
        summary: 'Check if user is logged in',
        responseDto: LoginResponsePayloadDto,
        requiresAuth: true,
        errors: [
            { status: 401, description: 'Unauthorized - invalid or missing token' },
            { status: 404, description: 'User not found' },
        ],
    })
    async checkUserLogin(
        @CurrentUser() user: interfaces.IJwtPayload,
    ): Promise<ResponsePayloadDto<interfaces.IJwtPayload>> {
        return await this.authService.getUserInformation(user);
    }

    @Version(['1', VERSION_NEUTRAL])
    @Get('refresh-access-token')
    @Public()
    @UsePipes(ValidationPipe)
    @UseInterceptors(SetToken)
    @ApiSwagger({
        resourceName: 'Refresh Token',
        operation: 'custom',
        summary: 'Refresh access token',
        responseDto: LoginResponsePayloadDto,
        requiresAuth: false,
        errors: [
            {
                status: 401,
                description: 'Unauthorized - invalid or expired refresh token',
            },
            { status: 404, description: 'User not found' },
            { status: 500, description: 'Failed to generate new token' },
        ],
    })
    @ApiOperation({ summary: 'Refresh access token using refresh token' })
    async refreshAccessToken(
        @Query('refreshToken') refreshToken: string,
    ): Promise<LoginResponsePayloadDto> {
        return await this.authService.refreshAccessToken(refreshToken);
    }

    @Version(['1', VERSION_NEUTRAL])
    @Get('logout')
    @Public()
    @UseInterceptors(RemoveToken)
    @ApiSwagger({
        resourceName: 'Logout',
        operation: 'custom',
        summary: 'Logout user (clears auth cookies)',
        responseDto: String,
        requiresAuth: false,
        errors: [{ status: 500, description: 'Failed to clear session' }],
    })
    async logout(
        @CurrentUser() user: interfaces.IJwtPayload | null,
    ): Promise<ResponsePayloadDto<string>> {
        return await this.authService.logout(user);
    }

    @Version(['1', VERSION_NEUTRAL])
    @Post('register-fcm-token')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard)
    @ApiSwagger({
        resourceName: 'FCM Token',
        operation: 'custom',
        summary: 'Register FCM token for push notifications',
        requestDto: RegisterFcmTokenDto,
        responseDto: String,
        requiresAuth: true,
        errors: [
            { status: 400, description: 'Invalid FCM token' },
            { status: 401, description: 'Unauthorized' },
        ],
    })
    async registerFcmToken(
        @CurrentUser() user: interfaces.IJwtPayload,
        @Body() dto: RegisterFcmTokenDto,
    ): Promise<ResponsePayloadDto<string>> {
        return await this.authService.registerFcmToken(user, dto);
    }
}
