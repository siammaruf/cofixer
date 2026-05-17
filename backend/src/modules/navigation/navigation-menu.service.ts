import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { NavigationMenu } from './navigation-menu.entity';
import { NavigationMenuRepository } from './navigation-menu.repository';

@Injectable()
export class NavigationMenuService extends BaseService<NavigationMenu> {
    constructor(
        private readonly navigationMenuRepository: NavigationMenuRepository,
    ) {
        super(navigationMenuRepository, 'NavigationMenu');
    }

    async findByNameOrDefault(name: string): Promise<NavigationMenu> {
        const menu = await this.navigationMenuRepository.findByName(name);
        if (menu) return menu;
        const defaultMenu = new NavigationMenu();
        defaultMenu.name = name;
        defaultMenu.items = [];
        defaultMenu.isActive = true;
        return defaultMenu;
    }
}
