import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPostController } from './blog-post.controller';
import { BlogPostAdminController } from './blog-post.admin.controller';
import { BlogPostService } from './blog-post.service';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPost } from './blog-post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BlogPost])],
    controllers: [BlogPostController, BlogPostAdminController],
    providers: [BlogPostService, BlogPostRepository],
    exports: [BlogPostService, BlogPostRepository],
})
export class BlogModule {}
