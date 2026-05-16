import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCmsTables20260516000000 implements MigrationInterface {
    name = 'CreateCmsTables20260516000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. services
        await queryRunner.query(`
            CREATE TABLE "services" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "title" character varying(255) NOT NULL,
                "slug" character varying(255) NOT NULL,
                "description" text,
                "short_description" character varying(500),
                "icon" character varying(255),
                "image" character varying(255),
                "order" integer NOT NULL DEFAULT '0',
                "featured" boolean NOT NULL DEFAULT false,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "UQ_services_slug" UNIQUE ("slug"),
                CONSTRAINT "PK_services" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_services_slug" ON "services" ("slug")`);
        await queryRunner.query(`CREATE INDEX "IDX_services_featured" ON "services" ("featured")`);
        await queryRunner.query(`CREATE INDEX "IDX_services_is_active" ON "services" ("is_active")`);
        await queryRunner.query(`CREATE INDEX "IDX_services_order" ON "services" ("order")`);

        // 2. projects
        await queryRunner.query(`
            CREATE TABLE "projects" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "title" character varying(255) NOT NULL,
                "slug" character varying(255) NOT NULL,
                "summary" character varying(500),
                "description" text,
                "client_name" character varying(255),
                "category" character varying(255),
                "images" jsonb NOT NULL DEFAULT '[]'::jsonb,
                "featured_image" character varying(255),
                "featured" boolean NOT NULL DEFAULT false,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "UQ_projects_slug" UNIQUE ("slug"),
                CONSTRAINT "PK_projects" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_projects_slug" ON "projects" ("slug")`);
        await queryRunner.query(`CREATE INDEX "IDX_projects_featured" ON "projects" ("featured")`);
        await queryRunner.query(`CREATE INDEX "IDX_projects_is_active" ON "projects" ("is_active")`);
        await queryRunner.query(`CREATE INDEX "IDX_projects_category" ON "projects" ("category")`);

        // 3. blog_posts
        await queryRunner.query(`
            CREATE TABLE "blog_posts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "title" character varying(255) NOT NULL,
                "slug" character varying(255) NOT NULL,
                "excerpt" character varying(500),
                "content" text,
                "cover_image" character varying(255),
                "category" character varying(255),
                "tags" text,
                "author_name" character varying(255),
                "published_at" TIMESTAMP,
                "is_published" boolean NOT NULL DEFAULT false,
                CONSTRAINT "UQ_blog_posts_slug" UNIQUE ("slug"),
                CONSTRAINT "PK_blog_posts" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_blog_posts_slug" ON "blog_posts" ("slug")`);
        await queryRunner.query(`CREATE INDEX "IDX_blog_posts_is_published" ON "blog_posts" ("is_published")`);
        await queryRunner.query(`CREATE INDEX "IDX_blog_posts_published_at" ON "blog_posts" ("published_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_blog_posts_category" ON "blog_posts" ("category")`);

        // 4. team_members
        await queryRunner.query(`
            CREATE TABLE "team_members" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(255) NOT NULL,
                "role" character varying(255) NOT NULL,
                "bio" text,
                "image" character varying(255),
                "social_links" jsonb,
                "order" integer NOT NULL DEFAULT '0',
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_team_members" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_team_members_order" ON "team_members" ("order")`);
        await queryRunner.query(`CREATE INDEX "IDX_team_members_is_active" ON "team_members" ("is_active")`);

        // 5. testimonials
        await queryRunner.query(`
            CREATE TABLE "testimonials" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "client_name" character varying(255) NOT NULL,
                "client_role" character varying(255),
                "company" character varying(255),
                "content" text NOT NULL,
                "rating" integer NOT NULL,
                "image" character varying(255),
                "featured" boolean NOT NULL DEFAULT false,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_testimonials" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_testimonials_featured" ON "testimonials" ("featured")`);
        await queryRunner.query(`CREATE INDEX "IDX_testimonials_is_active" ON "testimonials" ("is_active")`);

        // 6. faqs
        await queryRunner.query(`
            CREATE TABLE "faqs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "question" character varying(500) NOT NULL,
                "answer" text NOT NULL,
                "category" character varying(255),
                "order" integer NOT NULL DEFAULT '0',
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_faqs" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_faqs_category" ON "faqs" ("category")`);
        await queryRunner.query(`CREATE INDEX "IDX_faqs_order" ON "faqs" ("order")`);
        await queryRunner.query(`CREATE INDEX "IDX_faqs_is_active" ON "faqs" ("is_active")`);

        // 7. contact_messages
        await queryRunner.query(`
            CREATE TABLE "contact_messages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(255) NOT NULL,
                "email" character varying(255) NOT NULL,
                "phone" character varying(50),
                "subject" character varying(255) NOT NULL,
                "message" text NOT NULL,
                "read" boolean NOT NULL DEFAULT false,
                "status" character varying(50) NOT NULL DEFAULT 'new',
                "notes" text,
                CONSTRAINT "PK_contact_messages" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_contact_messages_email" ON "contact_messages" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_contact_messages_status" ON "contact_messages" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_contact_messages_read" ON "contact_messages" ("read")`);

        // 8. seo_settings
        await queryRunner.query(`
            CREATE TABLE "seo_settings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "route" character varying(255) NOT NULL,
                "page_type" character varying(100) NOT NULL,
                "title" character varying(255),
                "meta_description" text,
                "meta_keywords" text,
                "og_title" character varying(255),
                "og_description" text,
                "og_image" character varying(255),
                "twitter_image" character varying(255),
                "canonical_url" character varying(500),
                "robots_meta" character varying(100) NOT NULL DEFAULT 'index, follow',
                "json_ld_schema" jsonb,
                "custom_head_scripts" text,
                CONSTRAINT "UQ_seo_settings_route" UNIQUE ("route"),
                CONSTRAINT "PK_seo_settings" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_seo_settings_route" ON "seo_settings" ("route")`);
        await queryRunner.query(`CREATE INDEX "IDX_seo_settings_page_type" ON "seo_settings" ("page_type")`);

        // 9. site_settings
        await queryRunner.query(`
            CREATE TABLE "site_settings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "site_name" character varying(255) NOT NULL DEFAULT 'Cofixer',
                "logo" character varying(255),
                "favicon" character varying(255),
                "copyright_text" text,
                "social_links" jsonb,
                "theme_colors" jsonb,
                "google_analytics_id" character varying(255),
                "google_tag_manager_id" character varying(255),
                "custom_scripts" text,
                CONSTRAINT "PK_site_settings" PRIMARY KEY ("id")
            )
        `);

        // 10. navigation_menus
        await queryRunner.query(`
            CREATE TABLE "navigation_menus" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(100) NOT NULL,
                "items" jsonb NOT NULL DEFAULT '[]'::jsonb,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_navigation_menus" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_navigation_menus_name" ON "navigation_menus" ("name")`);
        await queryRunner.query(`CREATE INDEX "IDX_navigation_menus_is_active" ON "navigation_menus" ("is_active")`);

        // 11. media
        await queryRunner.query(`
            CREATE TABLE "media" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "filename" character varying(255) NOT NULL,
                "original_name" character varying(255) NOT NULL,
                "mime_type" character varying(100) NOT NULL,
                "size" integer NOT NULL,
                "url" character varying(500) NOT NULL,
                "alt_text" character varying(255),
                "folder" character varying(100) DEFAULT 'general',
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_media" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_media_mime_type" ON "media" ("mime_type")`);
        await queryRunner.query(`CREATE INDEX "IDX_media_folder" ON "media" ("folder")`);
        await queryRunner.query(`CREATE INDEX "IDX_media_is_active" ON "media" ("is_active")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "media"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "navigation_menus"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "site_settings"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "seo_settings"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "contact_messages"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "faqs"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "testimonials"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "team_members"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "blog_posts"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "projects"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "services"`);
    }
}
