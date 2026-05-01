ALTER TABLE "tenants" ADD COLUMN "wompi_app_id" text;
ALTER TABLE "tenants" ADD COLUMN "wompi_api_secret" text;
ALTER TABLE "tenants" ADD COLUMN "wompi_is_production" boolean NOT NULL DEFAULT false;
