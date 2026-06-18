import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { envConfigService } from './env-config.service';

const typeOrmConfig = envConfigService.getTypeOrmConfig();

// Temporary debug log to verify DB connection config in production
console.log('[DB CONFIG] TypeORM connection config:', {
    host: typeOrmConfig.host,
    port: typeOrmConfig.port,
    username: typeOrmConfig.username,
    database: typeOrmConfig.database,
    synchronize: typeOrmConfig.synchronize,
});

export const appDataSource = new DataSource({
    type: 'postgres',
    ...typeOrmConfig,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrationsRun: true,
    migrationsTableName: 'migrations',
    migrations: [__dirname + '/../**/migrations/*{.ts,.js}'],
    namingStrategy: new SnakeNamingStrategy(),
    logging: true,
    logger: 'advanced-console',
});
