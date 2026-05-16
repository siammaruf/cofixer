import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceController } from './service.controller';
import { ServiceAdminController } from './service.admin.controller';
import { ServiceService } from './service.service';
import { ServiceRepository } from './service.repository';
import { Service } from './service.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Service])],
    controllers: [ServiceController, ServiceAdminController],
    providers: [ServiceService, ServiceRepository],
    exports: [ServiceService, ServiceRepository],
})
export class ServicesModule {}
