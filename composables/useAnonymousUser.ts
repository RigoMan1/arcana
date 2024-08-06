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

  const getOrCreateDevUser = async (): Promise<string | null> => {
    const devEmail = 'dev@example.com';
    const devPassword = 'securepassword';

    try {
      // Attempt to sign in the dev user
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: devEmail,
          password: devPassword,
        });

      if (signInError) {
        // If sign-in fails, try creating the user
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: devEmail,
            password: devPassword,
          });

        if (signUpError) {
          console.error('Error creating dev user:', signUpError);
          return null;
        }

        // Initialize user profile and energy balance for the new dev user
        await $fetch('/api/user-init', {
          method: 'POST',
          body: { userId: signUpData.user?.id },
        });

        return signUpData.user?.id ?? null;
      }

      // If sign-in succeeds, return the existing user ID
      return signInData.user?.id ?? null;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  };

  const getOrCreateAnonymousUser = async () => {
    if (user.value) {
      const userExists = await verifyUserExists(user.value.id);
      if (userExists) {
        return user.value;
      }
    }
    return await createAnonymousUser();
  };

  return { getOrCreateAnonymousUser, getOrCreateDevUser };
};
