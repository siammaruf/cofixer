import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { envConfigService } from '../../config/env-config.service';

@Injectable()
export class SetToken implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const res = context.switchToHttp().getResponse();
        const isProduction = process.env.MODE !== 'DEV';
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? ('none' as const) : ('lax' as const),
            path: '/',
        };
        const authConfig = envConfigService.getAuthJWTConfig();
        const accessTokenName =
            authConfig.AUTH_TOKEN_COOKIE_NAME || 'accessToken';
        const refreshTokenName =
            authConfig.AUTH_REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';

        return next.handle().pipe(
            map((value) => {
                if (value.success && value.data?.token) {
                    console.log(
                        `[SetToken] MODE=${process.env.MODE}, isProduction=${isProduction}, cookieOptions=`,
                        cookieOptions,
                        `cookieName=${accessTokenName}`,
                    );
                    res.cookie(
                        accessTokenName,
                        value.data.token,
                        cookieOptions,
                    );

                    if (value.data?.refreshToken) {
                        res.cookie(
                            refreshTokenName,
                            value.data.refreshToken,
                            cookieOptions,
                        );
                    }

                    return value;
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
