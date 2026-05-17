import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { User } from '../../modules/users/user.entity';
import { RolesEnum } from '../../shared/enums/role.enum';
import { ActiveStatusEnum } from '../../shared/enums/active-status.enum';
import { PasswordUtil } from '../../core/utils/password.util';

async function resetUsers() {
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);

    const userRepository = dataSource.getRepository(User);

    console.log('🔍 Checking existing users...');
    const existingUsers = await userRepository.find();
    console.log(`Found ${existingUsers.length} users:`);
    existingUsers.forEach((user) => {
        console.log(`  - ${user.email} (role: ${user.role})`);
    });

    console.log('\n🗑️  Deleting all users...');
    await userRepository.clear(); // Better way to delete all records
    console.log('✅ All users deleted');

    console.log('\n👥 Creating fresh users with proper password hashing...');

    // Create Admin User from environment variables
    const adminEmail = process.env.ADMIN_SEED_EMAIL;
    const adminPassword = process.env.ADMIN_SEED_PASSWORD;

    if (adminEmail && adminPassword) {
        const hashedAdminPassword = await PasswordUtil.hash(adminPassword);
        console.log(
            `Admin password hash: ${hashedAdminPassword.substring(0, 20)}...`,
        );

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

        // Verify password immediately
        const testAdmin = await userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email: adminEmail })
            .getOne();

        const isAdminPasswordValid = await PasswordUtil.compare(
            adminPassword,
            testAdmin!.password,
        );
        console.log(
            `   Password verification: ${isAdminPasswordValid ? '✅ VALID' : '❌ INVALID'}`,
        );
    } else {
        console.warn(
            '⚠️  ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD not set. Skipping admin reset.',
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

    // Verify password immediately
    const testUser = await userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email: 'user@example.com' })
        .getOne();

    const isUserPasswordValid = await PasswordUtil.compare(
        'user123',
        testUser!.password,
    );
    console.log(
        `   Password verification: ${isUserPasswordValid ? '✅ VALID' : '❌ INVALID'}`,
    );

    console.log(`\n✅ Successfully created users with verified passwords`);

    await app.close();
    console.log('\n✨ Reset completed successfully!');
}

resetUsers().catch((error) => {
    console.error('Reset failed:', error);
    process.exit(1);
});
