import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

import { LoginResponsePayloadDto, ResponsePayloadDto } from 'src/shared/dtos';
import {
    ActiveStatusEnum,
    RolesEnum,
    SocialLoginTypeEnum,
} from 'src/shared/enums';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { Otp } from '../otp/otp.entity';
import {
    ChangePasswordDto,
    ForgotPasswordDto,
    ForgotPasswordResponseDto,
    LoginDto,
    RegisterDto,
    RegisterFcmTokenDto,
    ResetPasswordDto,
    SocialLoginDto,
} from './dtos';
import { ChangeUserPasswordDto } from './dtos/change-user-password.dto';
import { User } from '@modules/users';
import { MailService } from '@infrastructure/mail';
import { IJwtPayload } from '@shared/interfaces';
import { TokenService } from '@infrastructure/token/token.service';
import { UtilsService } from '@infrastructure/utils/utils.service';
import { I18nHelper } from '@core/utils';

@Injectable()
export class AuthService {
    private readonly googleClient: OAuth2Client;

    constructor(
        @InjectDataSource() private dataSource: DataSource,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,

        private readonly logger: Logger,
        private readonly tokenService: TokenService,
        private readonly utilsService: UtilsService,
        private readonly i18nHelper: I18nHelper,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
    ) {
        this.googleClient = new OAuth2Client();
    }

    async login(
        userLogin: LoginDto,
    ): Promise<ResponsePayloadDto<LoginResponsePayloadDto>> {
        try {
            const userData = await this.userRepository
                .createQueryBuilder('user')
                .addSelect('user.password')
                .where('user.email = :email', { email: userLogin.email })
                .getOne();

            if (!userData) {
                this.logger.warn(`User not found: ${userLogin.email}`);
                const message = this.i18nHelper.t(
                    'translation.authentication.error.user_not_registered',
                );
                throw new NotFoundException(message);
            }

            const isMatch = await this.utilsService.isMatchHash(
                userLogin.password,
                userData.password,
            );

            if (!isMatch) {
                this.logger.warn(
                    `Invalid password attempt for user: ${userLogin.email}`,
                );
                throw new UnauthorizedException(
                    this.i18nHelper.t(
                        'translation.authentication.error.password_does_not_match',
                    ),
                );
            }

            if (userData.isActive === ActiveStatusEnum.BLOCK) {
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.account_deleted',
                    ),
                );
            }

            if (userData.isActive === ActiveStatusEnum.IN_ACTIVE) {
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.account_inactive',
                    ),
                );
            }

            if (userData.isActive !== ActiveStatusEnum.ACTIVE) {
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.account_access_restricted',
                    ),
                );
            }

            const payload: IJwtPayload = {
                id: userData.id,
                fullName: userData.fullName,
                email: userData.email,
                role: userData.role,
                isActive: userData.isActive === ActiveStatusEnum.ACTIVE,
            };

            const refreshToken = this.tokenService.getRefreshToken(payload);
            const refreshTokenUpdate = await this.userRepository.update(
                userData.id,
                {
                    refreshToken: refreshToken,
                    rememberMe: userLogin.rememberMe || false,
                },
            );

            if (!refreshTokenUpdate || refreshTokenUpdate.affected === 0) {
                throw new InternalServerErrorException(
                    this.i18nHelper.t(
                        'translation.authentication.error.something_wrong',
                    ),
                );
            }

            // message: this.i18nHelper.t(
            //   'translation.authentication.success.access_granted',
            // ),
            const data = {
                token: this.tokenService.getAccessToken(
                    payload,
                    userLogin.rememberMe,
                ),
                refreshToken,
                user: {
                    id: userData.id,
                    fullName: userData.fullName,
                    email: userData.email,
                    role: userData.role,
                    isActive: userData.isActive === ActiveStatusEnum.ACTIVE,
                },
            };
            return new ResponsePayloadDto({
                success: true,
                statusCode: 200,
                message: 'Access granted',
                data,
                timestamp: new Date().toISOString(),
            });
        } catch (error: any) {
            this.logger.error('Login error:', error);
            this.logger.error('Error type:', error?.constructor?.name);
            this.logger.error('Error message:', error?.message);
            this.logger.error('Error stack:', error?.stack);

            // Re-throw known HTTP exceptions
            if (
                error instanceof NotFoundException ||
                error instanceof UnauthorizedException ||
                error instanceof BadRequestException ||
                error instanceof InternalServerErrorException
            ) {
                throw error;
            }

            // Handle database errors
            if (error instanceof QueryFailedError) {
                if (
                    error.driverError?.errno === 1062 ||
                    error.driverError?.code === '23505'
                ) {
                    throw new BadRequestException(
                        this.i18nHelper.t(
                            'translation.authentication.error.duplicate_entry',
                            {},
                        ),
                    );
                }
                throw new InternalServerErrorException(
                    this.i18nHelper.t(
                        'translation.authentication.error.database_error',
                        {},
                    ),
                );
            }

            // Generic error
            throw new InternalServerErrorException(
                this.i18nHelper.t(
                    'translation.authentication.error.something_wrong',
                    {},
                ),
            );
        }
    }

    async register(
        data: RegisterDto,
    ): Promise<ResponsePayloadDto<{ email: string; expiresAt: Date }>> {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email: data.email },
            });

            if (existingUser) {
                throw new ConflictException(
                    this.i18nHelper.t('translation.users.errors.email_exists', {
                        email: data.email,
                    }),
                );
            }

            const hashedPassword = await this.utilsService.getHash(
                data.password,
            );
            const fullName = [data.firstName, data.lastName]
                .filter(Boolean)
                .join(' ');

            await this.userRepository.save({
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                fullName: fullName || data.email,
                role: RolesEnum.USER,
                isActive: ActiveStatusEnum.IN_ACTIVE,
                isVerified: false,
                emailVerified: false,
            });

            // Generate and send OTP for email verification
            const otp = this.utilsService.generateUniqueOTP(4);
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 2);

            const emailOtp = await this.otpRepository.findOne({
                where: { email: data.email },
            });

            if (!emailOtp) {
                await this.otpRepository.save({
                    email: data.email,
                    otp: otp,
                    expiresAt: expiresAt,
                });
            } else {
                await this.otpRepository.update(emailOtp.id, {
                    otp: otp,
                    expiresAt: expiresAt,
                });
            }

            await this.mailService.sendRegistrationOtpEmail(data.email, otp);

            if (process.env.MODE === 'DEV') {
                console.log(`Registration OTP for ${data.email}: ${otp}`);
            }

            return new ResponsePayloadDto({
                success: true,
                statusCode: 201,
                message: this.i18nHelper.t(
                    'translation.otp.success.otp_sent_to_email',
                    {},
                ),
                data: { email: data.email, expiresAt },
                timestamp: new Date().toISOString(),
            });
        } catch (error: any) {
            this.logger.error('Registration error:', error);
            if (error instanceof ConflictException) {
                throw error;
            }
            if (error instanceof QueryFailedError) {
                throw new InternalServerErrorException(
                    this.i18nHelper.t(
                        'translation.authentication.error.database_error',
                        {},
                    ),
                );
            }
            throw new InternalServerErrorException(
                this.i18nHelper.t(
                    'translation.authentication.error.something_wrong',
                    {},
                ),
            );
        }
    }

    async verifyEmail(
        email: string,
        otp: string,
    ): Promise<LoginResponsePayloadDto> {
        try {
            const emailOtp = await this.otpRepository.findOne({
                where: { email },
            });

            if (!emailOtp) {
                throw new BadRequestException(
                    this.i18nHelper.t('translation.otp.error.otp_not_found'),
                );
            }

            if (emailOtp.otp !== parseInt(otp, 10)) {
                throw new BadRequestException(
                    this.i18nHelper.t('translation.otp.error.invalid_otp_code'),
                );
            }

            if (
                emailOtp.expiresAt &&
                new Date() > new Date(emailOtp.expiresAt)
            ) {
                throw new BadRequestException(
                    this.i18nHelper.t('translation.otp.error.otp_expired'),
                );
            }

            await this.otpRepository.delete({ email });

            const user = await this.userRepository.findOne({
                where: { email },
            });

            if (!user) {
                throw new NotFoundException(
                    this.i18nHelper.t(
                        'translation.authentication.error.user_not_found_by_email',
                    ),
                );
            }

            await this.userRepository.update(user.id, {
                isVerified: true,
                emailVerified: true,
                isActive: ActiveStatusEnum.ACTIVE,
            });

            // Auto-login after email verification
            const payload: IJwtPayload = {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isActive: true,
            };

            const refreshToken = this.tokenService.getRefreshToken(payload);
            await this.userRepository.update(user.id, {
                refreshToken: refreshToken,
            });

            return {
                success: true,
                message: this.i18nHelper.t(
                    'translation.authentication.success.email_verified',
                ),
                token: this.tokenService.getAccessToken(payload),
                refreshToken,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    isActive: true,
                },
            } as LoginResponsePayloadDto;
        } catch (error: any) {
            this.logger.error('Verify email error:', error);
            throw error;
        }
    }

    async adminLogin(
        userLogin: LoginDto,
    ): Promise<ResponsePayloadDto<LoginResponsePayloadDto>> {
        try {
            const userData = await this.userRepository
                .createQueryBuilder('user')
                .addSelect('user.password')
                .where('user.email = :email', { email: userLogin.email })
                .getOne();

            if (!userData) {
                this.logger.warn(`Admin user not found: ${userLogin.email}`);
                throw new NotFoundException(
                    this.i18nHelper.t(
                        'translation.authentication.error.user_not_registered',
                    ),
                );
            }

            const isMatch = await this.utilsService.isMatchHash(
                userLogin.password,
                userData.password,
            );

            if (!isMatch) {
                this.logger.warn(
                    `Invalid password attempt for admin: ${userLogin.email}`,
                );
                throw new UnauthorizedException(
                    this.i18nHelper.t(
                        'translation.authentication.error.password_does_not_match',
                    ),
                );
            }

            if (userData.role !== RolesEnum.ADMIN) {
                this.logger.warn(
                    `Non-admin user attempted admin login: ${userLogin.email}`,
                );
                throw new UnauthorizedException(
                    this.i18nHelper.t(
                        'translation.authentication.error.admin_access_required',
                    ),
                );
            }

            if (userData.isActive === ActiveStatusEnum.BLOCK) {
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.account_deleted',
                    ),
                );
            }

            if (userData.isActive === ActiveStatusEnum.IN_ACTIVE) {
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.account_inactive',
                    ),
                );
            }

            if (userData.isActive !== ActiveStatusEnum.ACTIVE) {
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.account_access_restricted',
                    ),
                );
            }

            const payload: IJwtPayload = {
                id: userData.id,
                fullName: userData.fullName,
                email: userData.email,
                role: userData.role,
                isActive: userData.isActive === ActiveStatusEnum.ACTIVE,
            };

            const refreshToken = this.tokenService.getRefreshToken(payload);
            const refreshTokenUpdate = await this.userRepository.update(
                userData.id,
                {
                    refreshToken: refreshToken,
                    rememberMe: userLogin.rememberMe || false,
                },
            );

            if (!refreshTokenUpdate || refreshTokenUpdate.affected === 0) {
                throw new InternalServerErrorException(
                    this.i18nHelper.t(
                        'translation.authentication.error.something_wrong',
                    ),
                );
            }

            const data = {
                token: this.tokenService.getAccessToken(
                    payload,
                    userLogin.rememberMe,
                ),
                refreshToken,
                user: {
                    id: userData.id,
                    fullName: userData.fullName,
                    email: userData.email,
                    role: userData.role,
                    isActive: userData.isActive === ActiveStatusEnum.ACTIVE,
                },
            };

            return new ResponsePayloadDto({
                success: true,
                statusCode: 200,
                message: this.i18nHelper.t(
                    'translation.authentication.success.admin_login',
                ),
                data,
                timestamp: new Date().toISOString(),
            });
        } catch (error: any) {
            this.logger.error('Admin login error:', error);
            this.logger.error('Error type:', error?.constructor?.name);
            this.logger.error('Error message:', error?.message);
            this.logger.error('Error stack:', error?.stack);

            // Re-throw known HTTP exceptions
            if (
                error instanceof NotFoundException ||
                error instanceof UnauthorizedException ||
                error instanceof BadRequestException ||
                error instanceof InternalServerErrorException
            ) {
                throw error;
            }

            // Handle database errors
            if (error instanceof QueryFailedError) {
                if (
                    error.driverError?.errno === 1062 ||
                    error.driverError?.code === '23505'
                ) {
                    throw new BadRequestException(
                        this.i18nHelper.t(
                            'translation.authentication.error.duplicate_entry',
                            {},
                        ),
                    );
                }
                throw new InternalServerErrorException(
                    this.i18nHelper.t(
                        'translation.authentication.error.database_error',
                        {},
                    ),
                );
            }

            // Generic error
            throw new InternalServerErrorException(
                this.i18nHelper.t(
                    'translation.authentication.error.something_wrong',
                    {},
                ),
            );
        }
    }

    async socialLogin(data: SocialLoginDto): Promise<LoginResponsePayloadDto> {
        try {
            if (
                !data.token ||
                !data.email ||
                !data.fullName ||
                !data.socialLoginType
            ) {
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.missing_social_login_fields',
                    ),
                );
            }

            let verifiedData: {
                email: string;
                fullName?: string;
                sub?: string;
            };
            try {
                verifiedData = await this.verifySocialLoginToken(
                    data.token,
                    data.socialLoginType,
                );

                if (verifiedData.email !== data.email) {
                    throw new BadRequestException(
                        this.i18nHelper.t(
                            'translation.authentication.error.email_mismatch',
                            {},
                        ),
                    );
                }

                // Validate fullName for all social login types
                if (
                    verifiedData.fullName &&
                    verifiedData.fullName !== data.fullName
                ) {
                    throw new BadRequestException(
                        this.i18nHelper.t(
                            'translation.authentication.error.fullname_mismatch',
                            {},
                        ),
                    );
                }
            } catch (error) {
                this.logger.error('Token verification failed:', error);
                throw error;
            }

            const userData = await this.userRepository.findOne({
                where: { email: data.email },
                select: [
                    'id',
                    'fullName',
                    'email',
                    'role',
                    'isActive',
                    'socialLoginType',
                ],
            });

            if (!userData) {
                if (!data.termsAndConditionsAccepted) {
                    throw new BadRequestException(
                        this.i18nHelper.t(
                            'translation.authentication.error.please_signup_first',
                        ),
                    );
                }

                return await this.dataSource.transaction(async (tx) => {
                    const slug = await this.getNextAvailableSlug();
                    const newUserData = {
                        slug: slug,
                        fullName: data.fullName,
                        email: data.email,
                        isActive: ActiveStatusEnum.ACTIVE,
                        role: RolesEnum.USER,
                        socialLoginType: data.socialLoginType,
                        password: await this.utilsService.getHash(''),
                        rememberMe: data.rememberMe || false,
                    };

                    const newUser = tx.create(User, newUserData);
                    const savedUser = await tx.save(User, newUser);

                    const payload: IJwtPayload = {
                        id: savedUser.id,
                        fullName: savedUser.fullName,
                        email: savedUser.email,
                        role: savedUser.role,
                        isActive: true,
                    };

                    const refreshToken =
                        this.tokenService.getRefreshToken(payload);
                    const accessToken = this.tokenService.getAccessToken(
                        payload,
                        data.rememberMe,
                    );

                    await tx.update(User, savedUser.id, {
                        refreshToken: refreshToken,
                        rememberMe: data.rememberMe || false,
                    });

                    return {
                        success: true,
                        message: this.i18nHelper.t(
                            'translation.authentication.success.signup_successful',
                        ),
                        token: accessToken,
                        refreshToken,
                        user: {
                            id: savedUser.id,
                            fullName: savedUser.fullName,
                            email: savedUser.email,
                            role: savedUser.role,
                            isActive: true,
                        },
                    } as LoginResponsePayloadDto;
                });
            } else {
                if (userData.isActive === ActiveStatusEnum.BLOCK) {
                    throw new BadRequestException(
                        this.i18nHelper.t(
                            'translation.authentication.error.account_deleted',
                            {},
                        ),
                    );
                }

                if (!userData.socialLoginType) {
                    await this.userRepository.update(userData.id, {
                        socialLoginType: data.socialLoginType,
                    });
                }

                const payload: IJwtPayload = {
                    id: userData.id,
                    fullName: userData.fullName,
                    email: userData.email,
                    role: userData.role,
                    isActive: userData.isActive === ActiveStatusEnum.ACTIVE,
                };

                const refreshToken = this.tokenService.getRefreshToken(payload);
                const accessToken = this.tokenService.getAccessToken(
                    payload,
                    data.rememberMe,
                );

                await this.userRepository.update(userData.id, {
                    refreshToken: refreshToken,
                    rememberMe: data.rememberMe || false,
                });

                return {
                    success: true,
                    message: this.i18nHelper.t(
                        'translation.authentication.success.login_successful',
                    ),
                    token: accessToken,
                    refreshToken,
                    user: {
                        id: userData.id,
                        fullName: userData.fullName,
                        email: userData.email,
                        role: userData.role,
                        isActive: userData.isActive === ActiveStatusEnum.ACTIVE,
                    },
                } as LoginResponsePayloadDto;
            }
        } catch (error) {
            this.logger.error('Social login error:', error);

            if (
                error instanceof BadRequestException ||
                error instanceof NotFoundException
            ) {
                throw error;
            }

            if (error instanceof QueryFailedError) {
                if (error.driverError.code === '23505') {
                    throw new BadRequestException(
                        this.i18nHelper.t(
                            'translation.authentication.error.email_already_exists',
                        ),
                    );
                }
                throw new InternalServerErrorException(
                    this.i18nHelper.t(
                        'translation.authentication.error.database_operation_failed',
                    ),
                );
            }

            throw new InternalServerErrorException(
                this.i18nHelper.t(
                    'translation.authentication.error.something_wrong',
                    {},
                ),
            );
        }
    }

    async changePassword(
        user: IJwtPayload,
        data: ChangePasswordDto,
    ): Promise<LoginResponsePayloadDto> {
        try {
            // Check if newPassword and confirmNewPassword match
            if (data.newPassword !== data.confirmNewPassword) {
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.passwords_do_not_match',
                    ),
                );
            }

            const userData = await this.userRepository.findOne({
                where: { id: user.id },
                select: ['id', 'password', 'isVerified'],
            });

            if (!userData) {
                throw new NotFoundException(
                    this.i18nHelper.t(
                        'translation.authentication.error.user_not_found',
                    ),
                );
            }

            if (!userData.isVerified) {
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.user_not_verified',
                    ),
                );
            }

            const isSamePassword = await this.utilsService.isMatchHash(
                data.newPassword,
                userData.password,
            );

            if (isSamePassword) {
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.new_old_password_same',
                    ),
                );
            }

            const hashPassword = await this.utilsService.getHash(
                data.newPassword,
            );
            const passwordUpdate = await this.userRepository.update(
                userData.id,
                {
                    password: hashPassword,
                    isVerified: false,
                },
            );

            if (!passwordUpdate || passwordUpdate.affected === 0) {
                throw new InternalServerErrorException(
                    this.i18nHelper.t(
                        'translation.authentication.error.something_wrong',
                    ),
                );
            }

            return {
                success: true,
                message: this.i18nHelper.t(
                    'translation.authentication.success.password_updated_successfully',
                ),
            } as LoginResponsePayloadDto;
        } catch (error: any) {
            this.logger.error(error);
            if (error instanceof QueryFailedError) {
                if (error.driverError.errno == 1062) {
                    throw new QueryFailedError(
                        'Duplicate Key Error',
                        [],
                        error,
                    );
                }
                throw new QueryFailedError(error.message, [], error);
            } else {
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    async changeUserPassword(
        user: IJwtPayload,
        data: ChangeUserPasswordDto,
    ): Promise<LoginResponsePayloadDto> {
        try {
            const userData = await this.userRepository.findOne({
                where: { id: user.id },
                select: ['id', 'password'],
            });

            if (!userData) {
                throw new NotFoundException(
                    this.i18nHelper.t(
                        'translation.authentication.error.user_not_found',
                    ),
                );
            }

            const isMatch = await this.utilsService.isMatchHash(
                data.currentPassword,
                userData.password,
            );

            if (!isMatch) {
                throw new UnauthorizedException(
                    this.i18nHelper.t(
                        'translation.authentication.error.current_password_incorrect',
                    ),
                );
            }

            const isSamePassword = await this.utilsService.isMatchHash(
                data.newPassword,
                userData.password,
            );

            if (isSamePassword) {
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.new_old_password_same',
                    ),
                );
            }

            const hashPassword = await this.utilsService.getHash(
                data.newPassword,
            );
            const passwordUpdate = await this.userRepository.update(
                userData.id,
                {
                    password: hashPassword,
                },
            );

            if (!passwordUpdate || passwordUpdate.affected === 0) {
                throw new InternalServerErrorException(
                    this.i18nHelper.t(
                        'translation.authentication.error.something_wrong',
                    ),
                );
            }

            return {
                success: true,
                message: this.i18nHelper.t(
                    'translation.authentication.success.password_updated_successfully',
                ),
            } as LoginResponsePayloadDto;
        } catch (error: any) {
            this.logger.error('Change user password error:', error);
            if (
                error instanceof NotFoundException ||
                error instanceof UnauthorizedException ||
                error instanceof BadRequestException ||
                error instanceof InternalServerErrorException
            ) {
                throw error;
            }
            if (error instanceof QueryFailedError) {
                throw new InternalServerErrorException(
                    this.i18nHelper.t(
                        'translation.authentication.error.database_error',
                        {},
                    ),
                );
            }
            throw new InternalServerErrorException(
                this.i18nHelper.t(
                    'translation.authentication.error.something_wrong',
                    {},
                ),
            );
        }
    }

    async forgotPassword(
        data: ForgotPasswordDto,
    ): Promise<ForgotPasswordResponseDto> {
        try {
            const userData = await this.userRepository.findOne({
                where: { email: data.email },
            });

            if (!userData) {
                throw new NotFoundException(
                    this.i18nHelper.t(
                        'translation.authentication.error.user_not_found_email',
                    ),
                );
            }

            const otp = this.utilsService.generateUniqueOTP(4);
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 2);

            const emailOtp = await this.otpRepository.findOne({
                where: { email: data.email },
            });

            if (!emailOtp) {
                await this.otpRepository.save({
                    email: data.email,
                    otp: otp,
                    expiresAt: expiresAt,
                });
            } else {
                await this.otpRepository.update(emailOtp.id, {
                    otp: otp,
                    expiresAt: expiresAt,
                });
            }

            await this.mailService.sendResetPasswordEmail(data.email, otp);

            return {
                success: true,
                message: this.i18nHelper.t(
                    'translation.otp.success.otp_sent_to_email',
                    {},
                ),
                email: data.email,
            };
        } catch (error: any) {
            this.logger.error(error);
            if (error instanceof QueryFailedError) {
                if (error.driverError.errno == 1062) {
                    throw new QueryFailedError(
                        'Duplicate Key Error',
                        [],
                        error,
                    );
                }
                throw new QueryFailedError(error.message, [], error);
            } else {
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    async verifyOtp(email: string, otp: string): Promise<{ valid: boolean }> {
        try {
            const emailOtp = await this.otpRepository.findOne({
                where: { email },
            });

            if (!emailOtp) {
                throw new BadRequestException(
                    this.i18nHelper.t('translation.otp.error.otp_not_found'),
                );
            }

            if (emailOtp.otp !== parseInt(otp, 10)) {
                throw new BadRequestException(
                    this.i18nHelper.t('translation.otp.error.invalid_otp_code'),
                );
            }

            if (
                emailOtp.expiresAt &&
                new Date() > new Date(emailOtp.expiresAt)
            ) {
                throw new BadRequestException(
                    this.i18nHelper.t('translation.otp.error.otp_expired'),
                );
            }

            return { valid: true };
        } catch (error: any) {
            this.logger.error('Verify OTP error:', error);
            throw error;
        }
    }

    async resetPassword(
        data: ResetPasswordDto,
    ): Promise<LoginResponsePayloadDto> {
        try {
            const userData = await this.userRepository.findOne({
                where: {
                    email: data.email,
                },
            });

            if (!userData) {
                throw new NotFoundException(
                    this.i18nHelper.t(
                        'translation.authentication.error.user_not_found_by_email',
                    ),
                );
            }

            // Verify OTP before allowing password reset
            await this.verifyOtp(data.email, data.otp);

            // Delete the OTP after successful verification
            await this.otpRepository.delete({ email: data.email });

            const hashPassword = await this.utilsService.getHash(data.password);
            const passwordUpdate = await this.userRepository.update(
                userData.id,
                {
                    password: hashPassword,
                },
            );

            if (!passwordUpdate || passwordUpdate.affected === 0) {
                throw new InternalServerErrorException(
                    this.i18nHelper.t(
                        'translation.authentication.error.something_wrong',
                    ),
                );
            }

            return {
                success: true,
                message: this.i18nHelper.t(
                    'translation.authentication.success.password_updated',
                ),
            } as LoginResponsePayloadDto;
        } catch (error: any) {
            this.logger.error(error);
            if (error instanceof QueryFailedError) {
                if (error.driverError.errno == 1062) {
                    throw new QueryFailedError(
                        'Duplicate Key Error',
                        [],
                        error,
                    );
                }
                throw new QueryFailedError(error.message, [], error);
            } else {
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    async refreshAccessToken(
        refreshToken: string,
    ): Promise<LoginResponsePayloadDto> {
        try {
            const userData = await this.userRepository.findOne({
                where: { refreshToken: refreshToken },
            });

            if (!userData) {
                throw new UnauthorizedException(
                    this.i18nHelper.t(
                        'translation.authentication.error.invalid_refresh_token',
                    ),
                );
            }

            this.tokenService.verifyToken(refreshToken);
            const payload: IJwtPayload = {
                id: userData.id,
                fullName: userData.fullName,
                email: userData.email,
                role: userData.role,
                isActive: userData.isActive === ActiveStatusEnum.ACTIVE,
            };
            return {
                success: true,
                message: this.i18nHelper.t(
                    'translation.authentication.success.access_granted',
                ),
                token: this.tokenService.getAccessToken(payload),
            } as LoginResponsePayloadDto;
        } catch (error: any) {
            this.logger.error('Refresh token error:', error);

            if (error instanceof UnauthorizedException) {
                throw error;
            }

            if (error instanceof QueryFailedError) {
                throw new InternalServerErrorException(
                    this.i18nHelper.t(
                        'translation.authentication.error.database_error',
                        {},
                    ),
                );
            }

            throw new InternalServerErrorException(
                this.i18nHelper.t(
                    'translation.authentication.error.something_wrong',
                    {},
                ),
            );
        }
    }

    async getUserInformation(
        user: IJwtPayload,
    ): Promise<ResponsePayloadDto<IJwtPayload>> {
        try {
            const userData = await this.userRepository
                .createQueryBuilder('user')
                .addSelect('user.refreshToken')
                .where('user.id = :id', { id: user.id })
                .getOne();

            if (!userData) {
                throw new NotFoundException(
                    this.i18nHelper.t(
                        'translation.authentication.error.invalid_user',
                        {},
                    ),
                );
            }

            const payload: IJwtPayload = {
                id: userData.id,
                fullName: userData.fullName,
                email: userData.email,
                role: userData.role,
                image: userData.image,
                isActive: userData.isActive === ActiveStatusEnum.ACTIVE,
            };

            return new ResponsePayloadDto<IJwtPayload>({
                success: true,
                message: this.i18nHelper.t(
                    'translation.authentication.success.user_information_retrieved',
                ),
                data: payload,
            });
        } catch (error: any) {
            this.logger.error(error);
            if (error instanceof QueryFailedError) {
                if (error.driverError.errno == 1062) {
                    throw new QueryFailedError(
                        'Duplicate Key Error',
                        [],
                        error,
                    );
                }
                throw new QueryFailedError(error.message, [], error);
            } else {
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    async logout(
        user: IJwtPayload | null,
    ): Promise<ResponsePayloadDto<string>> {
        try {
            if (user)
                await this.userRepository.update(user.id, {
                    refreshToken: null,
                });
            return {
                success: true,
                message: this.i18nHelper.t(
                    'translation.authentication.success.successfully_logout',
                ),
            } as ResponsePayloadDto<string>;
        } catch (error: any) {
            this.logger.error(error);
            if (error instanceof QueryFailedError) {
                if (error.driverError.errno == 1062) {
                    throw new QueryFailedError(
                        'Duplicate Key Error',
                        [],
                        error,
                    );
                }
                throw new QueryFailedError(error.message, [], error);
            } else {
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    private async getNextAvailableSlug(): Promise<number> {
        const maxSlugResult = await this.userRepository
            .createQueryBuilder('user')
            .select('MAX(user.slug)', 'maxSlug')
            .getRawOne();

        const maxSlug = maxSlugResult?.maxSlug || 0;
        return maxSlug + 1;
    }

    private async verifySocialLoginToken(
        token: string,
        socialLoginType: SocialLoginTypeEnum,
    ): Promise<{ email: string; fullName?: string; sub?: string }> {
        switch (socialLoginType) {
            case SocialLoginTypeEnum.GOOGLE:
                return await this.verifyGoogleToken(token);

            default:
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.unsupported_social_login',
                    ),
                );
        }
    }

    private async verifyGoogleToken(
        token: string,
    ): Promise<{ email: string; fullName?: string; sub?: string }> {
        try {
            const response = await axios.get(
                `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
            );

            const googleUser = response.data;

            if (!googleUser || !googleUser.sub) {
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.invalid_google_token',
                        {},
                    ),
                );
            }

            const email = googleUser.email;
            if (!email || googleUser.email_verified !== 'true') {
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.google_email_not_verified',
                    ),
                );
            }

            return {
                email: email,
                fullName: googleUser.name || email.split('@')[0],
                sub: googleUser.sub,
            };
        } catch (error) {
            this.logger.error('Google token verification failed:', error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            if (error.response) {
                this.logger.error(
                    'Google API error response:',
                    error.response.data,
                );
                throw new BadRequestException(
                    this.i18nHelper.t(
                        'translation.authentication.error.invalid_google_token',
                        {},
                    ),
                );
            }

            throw new BadRequestException(
                this.i18nHelper.t(
                    'translation.authentication.error.google_verification_failed',
                ),
            );
        }
    }

    async registerFcmToken(
        user: IJwtPayload,
        dto: RegisterFcmTokenDto,
    ): Promise<ResponsePayloadDto<string>> {
        try {
            const userData = await this.userRepository.findOne({
                where: { id: user.id },
                select: ['id', 'deviceFcmTokens'],
            });

            if (!userData) {
                throw new NotFoundException(
                    this.i18nHelper.t(
                        'translation.authentication.error.user_not_found',
                        {},
                    ),
                );
            }

            const currentTokens = userData.deviceFcmTokens || [];

            if (currentTokens.includes(dto.fcmToken)) {
                return {
                    success: true,
                    statusCode: 200,
                    message: this.i18nHelper.t(
                        'translation.notification.success.fcm_token_already_registered',
                    ),
                };
            }

            const updatedTokens = [...currentTokens, dto.fcmToken];

            await this.userRepository.update(userData.id, {
                deviceFcmTokens: updatedTokens,
            });

            return {
                success: true,
                statusCode: 200,
                message: this.i18nHelper.t(
                    'translation.notification.success.fcm_token_registered',
                ),
            };
        } catch (error) {
            this.logger.error('Failed to register FCM token:', error);

            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new InternalServerErrorException(
                this.i18nHelper.t(
                    'translation.notification.error.fcm_token_registration_failed',
                ),
            );
        }
    }
}
