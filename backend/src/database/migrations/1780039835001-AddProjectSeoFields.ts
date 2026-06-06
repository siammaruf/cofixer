import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectSeoFields1780039835001 implements MigrationInterface {
    name = 'AddProjectSeoFields1780039835001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "projects"
            ADD COLUMN IF NOT EXISTS "meta_title" character varying(255)
        `);
        await queryRunner.query(`
            ALTER TABLE "projects"
            ADD COLUMN IF NOT EXISTS "meta_description" text
        `);
        await queryRunner.query(`
            ALTER TABLE "projects"
            ADD COLUMN IF NOT EXISTS "meta_keywords" text
        `);
        await queryRunner.query(`
            ALTER TABLE "projects"
            ADD COLUMN IF NOT EXISTS "og_image" character varying(255)
        `);
        await queryRunner.query(`
            ALTER TABLE "projects"
            ADD COLUMN IF NOT EXISTS "canonical_url" character varying(500)
        `);
        await queryRunner.query(`
            ALTER TABLE "projects"
            ADD COLUMN IF NOT EXISTS "robots_meta" character varying(100) DEFAULT 'index, follow'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "robots_meta"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "canonical_url"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "og_image"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "meta_keywords"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "meta_description"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "meta_title"`);
    }
}
