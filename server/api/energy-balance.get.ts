// ~/server/api/energy-balance.ts

import { db } from '@/server/db';
import { currencyBalance } from '@/server/schemas/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { userId }: { userId: string } = await getQuery(event);

  if (!userId) {
    return { error: 'User ID is required' };
  }

  try {
    const result = await db
      .select()
      .from(currencyBalance)
      .where(eq(currencyBalance.userId, userId))
      .execute();

    if (result.length === 0) {
      return { message: 'No currency balance found for the specified user.' };
    }

    return { energyBalance: result[0].basicEnergy };
  } catch (err) {
    console.error('Server error:', err);
    return { error: 'Server error when fetching currency balance' };
  }
});
