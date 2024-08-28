import { db } from '@/server/db';
import { unlockedSpreads } from '@/server/schemas/schema';

export default defineEventHandler(async (event) => {
  const {
    spreadId,
    userId,
  }: {
    userId: string;
    spreadId: string;
  } = await getQuery(event);

  if (!userId) {
    return { error: 'userId is required' };
  }

  try {
    const result = await db
      .insert(unlockedSpreads)
      .values({
        userId,
        spreadId: spreadId,
      })
      .execute();

    return result;
  } catch (err: any) {
    return { error: err.message };
  }
});
