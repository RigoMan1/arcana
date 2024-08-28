import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { unlockedSpreads } from '@/server/schemas/schema';

export default defineEventHandler(async (event) => {
  const { userId }: { userId: string } = await getQuery(event);

  if (!userId) {
    return { error: 'Missing userId' };
  }

  try {
    const result = await db
      .select()
      .from(unlockedSpreads)
      .where(eq(unlockedSpreads.userId, userId))
      .execute();

    // Returning only the spread IDs
    return result.map((r) => r.spreadId);
  } catch (err: any) {
    return { error: err.message };
  }
});
