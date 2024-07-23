import { db } from '@/server/db';
import { currencyBalance } from '@/server/schemas/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const {
    userId,
    amount,
    action,
  }: { userId: string; amount: number; action: 'add' | 'deduct' } =
    await readBody(event);

  if (!userId || amount < 0 || !action) {
    return { error: 'User ID, amount, and action are required' };
  }

  try {
    const result = await db
      .select()
      .from(currencyBalance)
      .where(eq(currencyBalance.userId, userId))
      .execute();

    if (result.length === 0) {
      return { error: 'No currency balance found for the specified user.' };
    }

    const currentBalance = result[0].basicEnergy;
    const newBalance =
      action === 'add' ? currentBalance + amount : currentBalance - amount;

    await db
      .update(currencyBalance)
      .set({ basicEnergy: newBalance })
      .where(eq(currencyBalance.userId, userId))
      .execute();

    return { message: 'Energy balance updated successfully', newBalance };
  } catch (err) {
    console.error('Server error:', err);
    return { error: 'Server error when updating energy balance' };
  }
});
