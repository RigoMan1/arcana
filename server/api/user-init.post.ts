import { currencyBalance, profiles } from '@/server/schemas/schema';
import { db } from '@/server/db';

export default defineEventHandler(async (event) => {
  const { userId } = await readBody(event);

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(profiles)
        .values({
          userId,
          name: '',
        })
        .execute();

      await tx
        .insert(currencyBalance)
        .values({
          userId,
          basicEnergy: 100,
        })
        .execute();
    });

    console.log('Profile created successfully');
  } catch (error) {
    console.error('Failed to initialize currency balance:', error);
    return { success: false, error: 'Failed to initialize currency balance' };
  }
});
