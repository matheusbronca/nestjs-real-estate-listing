import {
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const listings = pgTable('listings', {
  id: serial('id').primaryKey(),
  label: varchar('label', { length: 160 }).notNull(),
  addressLine1: text('address_line_1').notNull(),
  addressLine2: text('address_line_2'),
  addressCity: varchar('address_city', { length: 160 }).notNull(),
  addressZipCode: varchar('address_zipcode', { length: 160 }).notNull(),
  addressState: varchar('address_state', { length: 160 }).notNull(),
  price: integer('price').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  squareMeters: integer('squareMeters').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const listingRelations = relations(listings, ({ many }) => ({
  listingImages: many(listingImages),
}));

export const listingImages = pgTable('listing_images', {
  id: serial('id').primaryKey(),
  url: varchar('url', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  listingId: integer('listing_id').references(() => listings.id),
});

export const listingImagesRelatiosn = relations(listingImages, ({ one }) => ({
  listing: one(listings, {
    fields: [listingImages.listingId],
    references: [listings.id],
  }),
}));
