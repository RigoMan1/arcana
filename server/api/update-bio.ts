import { db } from '@/server/db';
import { profiles } from '@/server/schemas/schema';
import { eq } from 'drizzle-orm';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    return sendError(event, new Error('Authentication required'));
  }

  const { bio } = await readBody(event);

  if (typeof bio !== 'string') {
    return sendError(event, new Error('Bio must be a string'));
  }

  try {
    await db
      .update(profiles)
      .set({ bio })
      .where(eq(profiles.userId, user.id))
      .execute();

    return { success: true, message: 'Bio updated successfully.' };
  } catch (err) {
    console.error('Server error:', err);
    return sendError(event, new Error('Failed to update bio'));
  }
});
