import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  pgTable,
  serial,
  integer,
  uuid,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().unique(), // Ensures each user has only one profile
  name: text('name'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow().notNull(), // Adds created_at column
});

export type Profile = InferSelectModel<typeof profiles>;
export type InsertProfile = InferInsertModel<typeof profiles>;

export const currencyBalance = pgTable('currency_balance', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => profiles.userId, { onDelete: 'cascade' }), // Foreign key with cascade delete
  basicEnergy: integer('basic_energy').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(), // Adds created_at column
});

export type CurrencyBalance = InferSelectModel<typeof currencyBalance>;
export type InsertCurrencyBalance = InferInsertModel<typeof currencyBalance>;
