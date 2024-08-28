import { db } from '@/server/db';
import { eq } from 'drizzle-orm';

import { unlockedCharacters } from '@/server/schemas/schema';

export default defineEventHandler(async (event) => {
  const { userId }: { userId: string } = await getQuery(event);

  if (!userId) {
    return { error: 'Missing userId' };
  }

  try {
    const result = await db
      .select()
      .from(unlockedCharacters)
      .where(eq(unlockedCharacters.userId, userId))
      .execute();

    // return result;
    return result.map((r) => r.characterId);
  } catch (err: any) {
    return { error: err.message };
  }
});
