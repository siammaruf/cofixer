import { RolesEnum } from '@shared/enums';

export interface IJwtPayload {
    id: string;
    fullName: string | null | undefined;
    email: string;
    role: RolesEnum;

    image?: string | null;
    teamName?: string | null;
    isActive?: boolean;
}
