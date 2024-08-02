<script setup lang="ts">
const supabase = useSupabaseClient();

definePageMeta({ layout: 'auth' });

useSeoMeta({ title: 'Register - Arcana' });

interface Credentials {
  email: string;
  password: string;
}

// convert anonymous user to permanent user
const register = async ({ email, password }: Credentials) => {
  const emailRes = await supabase.auth.updateUser({ email });
  if (emailRes.error) throw emailRes.error;

  const pwRes = await supabase.auth.updateUser({ password });
  if (pwRes.error) throw pwRes.error;

  navigateTo('/');
};
</script>

<template>
  <div
    class="mx-auto px-8 py-12 pb-16 sm:mt-12 sm:max-w-[490px] sm:rounded-xl sm:p-16 mt-20"
  >
    <auth-form
      title="Create an Account"
      type="register"
      :on-submit="register"
    />

    <p class="mt-20 text-center">
      Already have an account?
      <nuxt-link
        to="/auth/login"
        class="font-semibold text-secondary-500"
      >
        Login
      </nuxt-link>
    </p>
  </div>
</template>
