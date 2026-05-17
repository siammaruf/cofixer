import { DataSource } from 'typeorm';
import { User } from 'src/modules/users/user.entity';
import { RolesEnum } from 'src/shared/enums/role.enum';
import { ActiveStatusEnum } from 'src/shared/enums/active-status.enum';
import { PasswordUtil } from 'src/core/utils/password.util';

export async function seedUsers(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // Check if users already exist
    const existingUsers = await userRepository.count();

    if (existingUsers > 0) {
        console.log(`ℹ️  ${existingUsers} user(s) already exist in database`);
        return;
    }

    console.log('Creating default users...');

    // Create Admin User from environment variables
    const adminEmail = process.env.ADMIN_SEED_EMAIL;
    const adminPassword = process.env.ADMIN_SEED_PASSWORD;

    if (adminEmail && adminPassword) {
        const hashedAdminPassword = await PasswordUtil.hash(adminPassword);
        const adminUser = userRepository.create({
            fullName: 'Admin User',
            email: adminEmail,
            password: hashedAdminPassword,
            role: RolesEnum.ADMIN,
            isActive: ActiveStatusEnum.ACTIVE,
            emailVerified: true,
        });
        await userRepository.save(adminUser);
        console.log(`✅ Admin user created: ${adminEmail}`);
    } else {
        console.warn(
            '⚠️  ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD not set. Skipping admin seed.',
        );
    }

    // Create Regular User
    const hashedUserPassword = await PasswordUtil.hash('user123');
    const regularUser = userRepository.create({
        fullName: 'Test User',
        email: 'user@example.com',
        password: hashedUserPassword,
        role: RolesEnum.USER,
        isActive: ActiveStatusEnum.ACTIVE,
        emailVerified: true,
    });
    await userRepository.save(regularUser);
    console.log('✅ Regular user created: user@example.com / user123');

    console.log(`✅ Successfully created users`);
}
