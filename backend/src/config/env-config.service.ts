import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

class EnvConfigService {
    constructor(private env: { [k: string]: string | undefined }) {}

    getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }
        return value as string;
    }

    public ensureValues(keys: string[]) {
        keys.forEach((k) => this.getValue(k, true));
        return this;
    }

    public getPort(): string {
        return this.getValue('PORT', true);
    }

    public isProduction(): boolean {
        const mode = this.getValue('MODE', false);
        return mode !== 'DEV';
    }

    public getFrontendUrl(): string {
        return this.getValue('FRONTEND_URL');
    }

    public getOrigins(): string[] {
        try {
            return this.getValue('ALLOW_ORIGINS')
                .split(',')
                .map((origin) => origin.trim());
        } catch {
            return [];
        }
    }

    public getTypeOrmConfig() {
        return {
            host: this.getValue('POSTGRES_HOST'),
            port: parseInt(this.getValue('POSTGRES_PORT')),
            username: this.getValue('POSTGRES_USER'),
            password: this.getValue('POSTGRES_PASSWORD'),
            database: this.getValue('POSTGRES_DATABASE'),

            synchronize: !this.isProduction(),
        };
    }

    public getMailConfig() {
        return {
            MAIL_HOST: this.getValue('MAIL_HOST', false) || 'smtp.gmail.com',
            MAIL_PORT: parseInt(this.getValue('MAIL_PORT', false)) || 465,
            MAIL_FROM: this.getValue('MAIL_FROM', false) || 'demo@example.com',
            MAIL_USER: this.getValue('MAIL_USER', false) || '',
            MAIL_PASS: this.getValue('MAIL_PASS', false) || '',
        };
    }

    public getAuthJWTConfig() {
        return {
            AUTH_JWT_SECRET: this.getValue('AUTH_JWT_SECRET'),
            AUTH_TOKEN_COOKIE_NAME: this.getValue('AUTH_TOKEN_COOKIE_NAME'),
            AUTH_TOKEN_EXPIRED_TIME: this.getValue('AUTH_TOKEN_EXPIRED_TIME'),
            AUTH_TOKEN_EXPIRED_TIME_REMEMBER_ME: this.getValue(
                'AUTH_TOKEN_EXPIRED_TIME_REMEMBER_ME',
            ),
            AUTH_REFRESH_TOKEN_COOKIE_NAME: this.getValue(
                'AUTH_REFRESH_TOKEN_COOKIE_NAME',
            ),
            AUTH_REFRESH_TOKEN_EXPIRED_TIME: this.getValue(
                'AUTH_REFRESH_TOKEN_EXPIRED_TIME',
            ),
        };
    }

    public getCloudinaryConfig() {
        return {
            cloudName: this.getValue('CLOUDINARY_CLOUD_NAME'),
            apiKey: this.getValue('CLOUDINARY_API_KEY'),
            apiSecret: this.getValue('CLOUDINARY_API_SECRET'),
            uploadPreset: this.getValue('CLOUDINARY_UPLOAD_PRESET', false) || '',
            folder: this.getValue('CLOUDINARY_FOLDER', false) || 'cofixer',
        };
    }

    public getRedisConfig() {
        return {
            host: this.getValue('REDIS_HOST', false) || 'localhost',
            port: parseInt(this.getValue('REDIS_PORT', false) || '6379'),
            password: this.getValue('REDIS_PASSWORD', false) || undefined,
            db: parseInt(this.getValue('REDIS_DB', false) || '0'),
        };
    }
}

const envConfigService = new EnvConfigService(process.env).ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE',
    'ALLOW_ORIGINS',
    'MODE',
    'FRONTEND_URL',

    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
]);

export { envConfigService };
