<script setup lang="ts">
const supabase = useSupabaseClient();

definePageMeta({ layout: 'auth' });

useSeoMeta({ title: 'Login - Arcana' });

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  navigateTo('/reader-selection');
};
</script>

<template>
  <div
    class="mx-auto px-8 py-12 pb-16 sm:mt-12 sm:max-w-[490px] sm:rounded-xl sm:p-16 mt-20"
  >
    <AuthForm
      title="Sign in"
      button-text="Sign In"
      loading-text="Signing in..."
      reset-password-link="/auth/reset-password"
      :on-submit="login"
    />
    <p class="mt-20 text-center">
      Don’t have an account yet?
      <nuxt-link
        to="/auth/register"
        class="font-semibold text-secondary-500"
        >Sign up</nuxt-link
      >
    </p>
  </div>
</template>
