import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlogCategories1780038557000 implements MigrationInterface {
    name = 'AddBlogCategories1780038557000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. blog_categories table
        await queryRunner.query(`
            CREATE TABLE "blog_categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(255) NOT NULL,
                "slug" character varying(255) NOT NULL,
                "description" text,
                "seo_title" character varying(255),
                "seo_description" text,
                CONSTRAINT "UQ_blog_categories_slug" UNIQUE ("slug"),
                CONSTRAINT "PK_blog_categories" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(
            `CREATE INDEX "IDX_blog_categories_slug" ON "blog_categories" ("slug")`,
        );

        // 2. join table for many-to-many relation
        await queryRunner.query(`
            CREATE TABLE "blog_posts_categories" (
                "blog_post_id" uuid NOT NULL,
                "category_id" uuid NOT NULL,
                CONSTRAINT "PK_blog_posts_categories" PRIMARY KEY ("blog_post_id", "category_id")
            )
        `);
        await queryRunner.query(
            `CREATE INDEX "IDX_blog_posts_categories_blog_post_id" ON "blog_posts_categories" ("blog_post_id")`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_blog_posts_categories_category_id" ON "blog_posts_categories" ("category_id")`,
        );
        await queryRunner.query(`
            ALTER TABLE "blog_posts_categories"
            ADD CONSTRAINT "FK_blog_posts_categories_blog_post"
            FOREIGN KEY ("blog_post_id") REFERENCES "blog_posts"("id")
            ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "blog_posts_categories"
            ADD CONSTRAINT "FK_blog_posts_categories_category"
            FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id")
            ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "blog_posts_categories"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "blog_categories"`);
    }
}
