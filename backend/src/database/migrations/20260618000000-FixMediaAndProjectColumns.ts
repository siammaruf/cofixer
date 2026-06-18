import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixMediaAndProjectColumns20260618000000 implements MigrationInterface {
    name = 'FixMediaAndProjectColumns20260618000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add missing media columns
        await queryRunner.query(`
            ALTER TABLE "media"
            ADD COLUMN IF NOT EXISTS "thumb_url" character varying(500)
        `);
        await queryRunner.query(`
            ALTER TABLE "media"
            ADD COLUMN IF NOT EXISTS "large_url" character varying(500)
        `);
        await queryRunner.query(`
            ALTER TABLE "media"
            ADD COLUMN IF NOT EXISTS "full_url" character varying(500)
        `);

        // Add missing projects columns
        await queryRunner.query(`
            ALTER TABLE "projects"
            ADD COLUMN IF NOT EXISTS "image_url" character varying(255)
        `);
        await queryRunner.query(`
            ALTER TABLE "projects"
            ADD COLUMN IF NOT EXISTS "live_url" character varying(255)
        `);
        await queryRunner.query(`
            ALTER TABLE "projects"
            ADD COLUMN IF NOT EXISTS "github_url" character varying(255)
        `);
        await queryRunner.query(`
            ALTER TABLE "projects"
            ADD COLUMN IF NOT EXISTS "tech_stack" jsonb NOT NULL DEFAULT '[]'::jsonb
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "projects" DROP COLUMN IF EXISTS "tech_stack"`,
        );
        await queryRunner.query(
            `ALTER TABLE "projects" DROP COLUMN IF EXISTS "github_url"`,
        );
        await queryRunner.query(
            `ALTER TABLE "projects" DROP COLUMN IF EXISTS "live_url"`,
        );
        await queryRunner.query(
            `ALTER TABLE "projects" DROP COLUMN IF EXISTS "image_url"`,
        );
        await queryRunner.query(
            `ALTER TABLE "media" DROP COLUMN IF EXISTS "full_url"`,
        );
        await queryRunner.query(
            `ALTER TABLE "media" DROP COLUMN IF EXISTS "large_url"`,
        );
        await queryRunner.query(
            `ALTER TABLE "media" DROP COLUMN IF EXISTS "thumb_url"`,
        );
    }
}
