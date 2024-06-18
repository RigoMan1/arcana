import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { pgTable, serial, integer, uuid, text } from 'drizzle-orm/pg-core';

export const currencyBalance = pgTable('currency_balance', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().unique(), // Ensures each user has only one currency balance
  basicEnergy: integer('basic_energy').notNull().default(0),
});

export type CurrencyBalance = InferSelectModel<typeof currencyBalance>;
export type InsertCurrencyBalance = InferInsertModel<typeof currencyBalance>;

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().unique(), // Ensures each user has only one currency balance
  name: text('name'),
});

export type Profile = InferSelectModel<typeof profiles>;
export type InsertProfile = InferInsertModel<typeof profiles>;
