import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategoryController } from './blog-category.controller';
import { BlogCategoryService } from './blog-category.service';
import { BlogCategoryRepository } from './blog-category.repository';
import { BlogCategory } from './blog-category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BlogCategory])],
    controllers: [BlogCategoryController],
    providers: [BlogCategoryService, BlogCategoryRepository],
    exports: [BlogCategoryService, BlogCategoryRepository],
})
export class BlogCategoryModule {}
