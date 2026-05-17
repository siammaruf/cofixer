import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { envConfigService } from '../../config/env-config.service';

@Injectable()
export class RemoveToken implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const res = context.switchToHttp().getResponse();
        const isProduction = process.env.MODE !== 'DEV';
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? ('none' as const) : ('lax' as const),
            path: '/',
            expires: new Date(0),
        };
        const authConfig = envConfigService.getAuthJWTConfig();
        const accessTokenName =
            authConfig.AUTH_TOKEN_COOKIE_NAME || 'accessToken';
        const refreshTokenName =
            authConfig.AUTH_REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';

        return next.handle().pipe(
            map((value) => {
                if (value.success) {
                    res.cookie(accessTokenName, '', cookieOptions);
                    res.cookie(refreshTokenName, '', cookieOptions);
                    return {
                        success: true,
                        message: value.message,
                        refreshToken: value?.refreshToken,
                    };
                } else {
                    return value;
                }
            }),
            catchError((err) => {
                return throwError(() => err);
            }),
        );
    }
}
