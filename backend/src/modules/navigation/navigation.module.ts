import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavigationMenuController } from './navigation-menu.controller';
import { NavigationMenuAdminController } from './navigation-menu.admin.controller';
import { NavigationMenuService } from './navigation-menu.service';
import { NavigationMenuRepository } from './navigation-menu.repository';
import { NavigationMenu } from './navigation-menu.entity';

@Module({
    imports: [TypeOrmModule.forFeature([NavigationMenu])],
    controllers: [NavigationMenuController, NavigationMenuAdminController],
    providers: [NavigationMenuService, NavigationMenuRepository],
    exports: [NavigationMenuService, NavigationMenuRepository],
})
export class NavigationModule {}
