import { db } from '@/server/db';
import { profiles } from '@/server/schemas/schema';
import { eq } from 'drizzle-orm';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) return sendError(event, new Error('Authentication required'));

  try {
    const result = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .execute();

    if (!result || result.length === 0) {
      return { error: 'Profile not found' };
    }

    return { profile: result[0] };
  } catch (err) {
    console.error('Server error:', err);
    return sendError(event, new Error('Failed to fetch profile'));
  }
});
