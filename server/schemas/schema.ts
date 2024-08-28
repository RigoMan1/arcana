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

// Table to store fortune teller characters
export const characters = pgTable('characters', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export type Character = InferSelectModel<typeof characters>;
export type InsertCharacter = InferInsertModel<typeof characters>;

// Table to track which fortune tellers are unlocked by which users
export const unlockedCharacters = pgTable('unlocked_characters', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  characterId: integer('character_id')
    .notNull()
    .references(() => characters.id, { onDelete: 'cascade' }),
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
});

export type UnlockedCharacter = InferSelectModel<typeof unlockedCharacters>;
export type InsertUnlockedCharacter = InferInsertModel<
  typeof unlockedCharacters
>;

// Simplified table to store only the ID and name of tarot spreads
export const spreads = pgTable('spreads', {
  id: serial('id').primaryKey(), // Auto-incrementing ID for each spread
  name: text('name').notNull(), // The name of the spread
});

export type Spread = InferSelectModel<typeof spreads>;
export type InsertSpread = InferInsertModel<typeof spreads>;

// Table to track which spreads are unlocked by which users
export const unlockedSpreads = pgTable('unlocked_spreads', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }), // Links to the profiles table
  spreadId: integer('spread_id')
    .notNull()
    .references(() => spreads.id, { onDelete: 'cascade' }), // Links to the spreads table
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(), // Timestamp when the spread was unlocked
});

export type UnlockedSpread = InferSelectModel<typeof unlockedSpreads>;
export type InsertUnlockedSpread = InferInsertModel<typeof unlockedSpreads>;
