import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectAdminController } from './project.admin.controller';
import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';
import { Project } from './project.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Project])],
    controllers: [ProjectController, ProjectAdminController],
    providers: [ProjectService, ProjectRepository],
    exports: [ProjectService, ProjectRepository],
})
export class ProjectsModule {}
