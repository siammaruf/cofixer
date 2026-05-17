import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { RolesEnum } from '../../shared/enums';

/**
 * Guard that ensures only super admin can create admin users.
 * Applied alongside RolesGuard on POST /users endpoint.
 */
@Injectable()
export class AdminCreationGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const body = request.body;
        const user = request.user;

        // If trying to create an admin user, only super admin is allowed
        if (Number(body.role) === Number(RolesEnum.ADMIN)) {
            if (Number(user?.role) !== Number(RolesEnum.SUPER_ADMIN)) {
                throw new ForbiddenException(
                    'Only super admin can create admin users',
                );
            }
        }

        return true;
    }
}
