<script setup lang="ts">
const supabase = useSupabaseClient();

definePageMeta({ layout: 'auth' });

useSeoMeta({ title: 'Register - Arcana' });

const register = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  navigateTo('/reader-select');
};
</script>

<template>
  <div
    class="mx-auto px-8 py-12 pb-16 sm:mt-12 sm:max-w-[490px] sm:rounded-xl sm:p-16 mt-20"
  >
    <auth-form
      title="Create an Account"
      button-text="Register"
      loading-text="Signing up..."
      :on-submit="register"
    />
    <p class="mt-20 text-center">
      Already have an account?
      <nuxt-link
        to="/auth/login"
        class="font-semibold text-secondary-500"
        >Login</nuxt-link
      >
    </p>
  </div>
</template>
