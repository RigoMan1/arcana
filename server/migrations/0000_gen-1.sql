CREATE TABLE IF NOT EXISTS "currency_balance" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"basic_energy" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "currency_balance_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
