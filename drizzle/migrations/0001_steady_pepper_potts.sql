CREATE TABLE "booking_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(30),
	"total_price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"notes" text,
	"status" varchar(50) DEFAULT 'PENDING' NOT NULL,
	"zone_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"staff_id" uuid NOT NULL,
	"rating" numeric(3, 2) NOT NULL,
	"comment" text,
	"responses" json DEFAULT '[]'::json NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "survey_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"question_text" text NOT NULL,
	"question_type" varchar(50) DEFAULT 'STARS' NOT NULL,
	"category" varchar(50) DEFAULT 'STAFF' NOT NULL,
	"is_required" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coverage_zones" DROP CONSTRAINT "coverage_zones_branch_id_branches_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "session_id" uuid;--> statement-breakpoint
ALTER TABLE "coverage_zones" ADD COLUMN "fee" numeric(10, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "coverage_zones" ADD COLUMN "description" varchar(500);--> statement-breakpoint
ALTER TABLE "coverage_zones" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "allows_home_service" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "phone" varchar(30);--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "emergency_contact_name" varchar(255);--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "emergency_contact_phone" varchar(30);--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "allows_home_service" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "home_service_lead_days" integer DEFAULT 7 NOT NULL;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "hero_title" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "hero_subtitle" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "email_body_template" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "reviews_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "vip_threshold" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "booking_sessions" ADD CONSTRAINT "booking_sessions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_sessions" ADD CONSTRAINT "booking_sessions_zone_id_coverage_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."coverage_zones"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_branches" ADD CONSTRAINT "service_branches_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_branches" ADD CONSTRAINT "service_branches_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_branches" ADD CONSTRAINT "service_branches_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "survey_questions" ADD CONSTRAINT "survey_questions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_session_id_booking_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."booking_sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coverage_zones" DROP COLUMN "branch_id";--> statement-breakpoint
ALTER TABLE "coverage_zones" DROP COLUMN "zip_code";--> statement-breakpoint
ALTER TABLE "coverage_zones" DROP COLUMN "radius_km";