import * as nodemailer from 'nodemailer';
import { envConfigService } from './env-config.service';

export const mailTransporter: nodemailer.Transporter =
    nodemailer.createTransport({
        service: 'gmail',
        host: envConfigService.getMailConfig().MAIL_HOST,
        port: envConfigService.getMailConfig().MAIL_PORT,
        secure: true,
        auth: {
            user: envConfigService.getMailConfig().MAIL_USER,
            pass: envConfigService.getMailConfig().MAIL_PASS,
        },
        tls: { rejectUnauthorized: false },
    });

export const mailFrom = envConfigService.getMailConfig().MAIL_FROM;
