import { db } from '@/server/db';
import { unlockedCharacters } from '@/server/schemas/schema';

export default defineEventHandler(async (event) => {
  const {
    characterId,
    userId,
  }: {
    userId: string;
    characterId: number;
  } = await getQuery(event);

  if (!userId) {
    return { error: 'userId is required' };
  }

  try {
    const result = await db
      .insert(unlockedCharacters)
      .values({
        userId,
        characterId: characterId,
      })
      .execute();

    return result;
  } catch (err: any) {
    return { error: err.message };
  }
});
