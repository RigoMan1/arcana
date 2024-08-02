import { currencyBalance, profiles } from '@/server/schemas/schema';
import { db } from '@/server/db';
import { NEW_BIO_TEMPLATE } from '~/constants/bio-template';

export default defineEventHandler(async (event) => {
  const { userId } = await readBody(event);

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(profiles)
        .values({
          userId,
          name: '',
          bio: NEW_BIO_TEMPLATE,
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
