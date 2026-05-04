-- Migration 0008: Platform-level config table (singleton, id always = 1)
-- Stores global settings for the super admin, e.g. Wompi payment credentials.

CREATE TABLE IF NOT EXISTS "platform_config" (
  "id"                    integer PRIMARY KEY DEFAULT 1,
  "wompi_app_id"          text,
  "wompi_api_secret"      text,
  "wompi_is_production"   boolean NOT NULL DEFAULT false,
  "updated_at"            timestamp with time zone NOT NULL DEFAULT now()
);

-- Ensure the singleton row exists
INSERT INTO "platform_config" ("id") VALUES (1) ON CONFLICT ("id") DO NOTHING;
