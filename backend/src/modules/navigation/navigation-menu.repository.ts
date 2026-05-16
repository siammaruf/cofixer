import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/base/base.repository';
import { NavigationMenu } from './navigation-menu.entity';

@Injectable()
export class NavigationMenuRepository extends BaseRepository<NavigationMenu> {
    constructor(
        @InjectRepository(NavigationMenu)
        repository: Repository<NavigationMenu>,
    ) {
        super(repository);
    }

    async findByName(name: string): Promise<NavigationMenu | null> {
        return this.repository.findOne({
            where: { name, isActive: true },
        });
    }
}
