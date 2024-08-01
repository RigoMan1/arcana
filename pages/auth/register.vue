<script setup lang="ts">
const supabase = useSupabaseClient();

definePageMeta({ layout: 'auth' });

useSeoMeta({ title: 'Register - Arcana' });

interface Credentials {
  email: string;
  password: string;
}

const register = async ({ email, password }: Credentials) => {
  try {
    console.log('updating email');
    const emailRes = await supabase.auth.updateUser({ email });
    console.log(emailRes);
    const pwRes = await supabase.auth.updateUser({ password });
    console.log(pwRes);

    navigateTo('/');
  } catch (error) {
    console.error(error);
  }
};

const loading = ref(false);
async function continueWithGoogle() {
  loading.value = true;
  const { data, error } = await supabase.auth.linkIdentity({
    provider: 'google',
  });

  if (error) throw error;

  console.log(data);
  loading.value = false;
}
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
    <arcana-button
      color="none"
      class="mt-8 w-full !bg-white !text-blue-800 !font-bold"
      text="Continue with Google"
      :loading="loading"
      loading-text="Signing up..."
      @click="continueWithGoogle"
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
