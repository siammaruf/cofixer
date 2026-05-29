import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlogPostSeoFields1780039835000 implements MigrationInterface {
    name = 'AddBlogPostSeoFields1780039835000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "blog_posts"
            ADD COLUMN IF NOT EXISTS "meta_title" character varying(255)
        `);
        await queryRunner.query(`
            ALTER TABLE "blog_posts"
            ADD COLUMN IF NOT EXISTS "meta_description" text
        `);
        await queryRunner.query(`
            ALTER TABLE "blog_posts"
            ADD COLUMN IF NOT EXISTS "og_image" character varying(255)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "og_image"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "meta_description"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "meta_title"`);
    }
}
