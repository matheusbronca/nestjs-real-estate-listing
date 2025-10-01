CREATE TABLE "listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar(160) NOT NULL,
	"address_line_1" text NOT NULL,
	"address_line_2" text,
	"address_city" varchar(160) NOT NULL,
	"address_zipcode" varchar(160) NOT NULL,
	"address_state" varchar(160) NOT NULL,
	"price" integer NOT NULL,
	"bathrooms" integer NOT NULL,
	"bedrooms" integer NOT NULL,
	"squareMeters" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;