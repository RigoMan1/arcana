export const useAnonymousUser = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const createAnonymousUser = async (): Promise<string | null> => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error('Error creating anonymous user:', error);
      return null;
    }

    // Initialize user profile and energy balance
    await $fetch('/api/user-init', {
      method: 'POST',
      body: { userId: data.user?.id },
    });

    return data.user?.id ?? null;
  };

  const verifyUserExists = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles') // Assuming 'profiles' is your user table
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        console.error('User does not exist or error fetching user:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error verifying user existence:', error);
      return false;
    }
  };

  const getOrCreateAnonymousUser = async () => {
    if (user.value) {
      const exists = await verifyUserExists(user.value.id);
      if (!exists) {
        console.log('User cached but not in database, creating new user.');
        return await createAnonymousUser();
      }
      console.log('User already exists:', user.value);
    } else {
      console.log('No user cached, creating new anonymous user.');
      return await createAnonymousUser();
    }
  };

  return { getOrCreateAnonymousUser };
};
