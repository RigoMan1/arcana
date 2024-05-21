<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { string, object } from 'yup';

const supabase = useSupabaseClient();

definePageMeta({ layout: 'auth' });

useSeoMeta({ title: 'Reset Password - Arcana' });

const { handleSubmit, resetForm } = useForm({
  validationSchema: object({
    email: string().required().email(),
  }),
});

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const submitResetPassword = handleSubmit(async ({ email }) => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    errorMessage.value = error.message;
  } else {
    successMessage.value = 'A reset link has been sent to your email address.';
    resetForm();
  }

  loading.value = false;
});
</script>

<template>
  <div
    class="mx-auto px-8 py-12 pb-16 sm:mt-12 sm:max-w-[490px] sm:rounded-xl sm:p-16 mt-20"
  >
    <div class="mx-auto max-w-[400px]">
      <h1 class="text-2xl text-center">Reset Password</h1>

      <v-alert
        v-if="errorMessage"
        color="error"
        class="mt-8"
      >
        {{ errorMessage }}
      </v-alert>
      <v-alert
        v-if="successMessage"
        color="success"
        class="mt-8"
      >
        {{ successMessage }}
      </v-alert>

      <form
        class="mt-8"
        @submit="submitResetPassword"
      >
        <VeeTextField
          name="email"
          label="Email"
          placeholder="Enter your email"
          autocomplete="email"
        />

        <arcana-button
          size="small"
          class="mt-8 w-full"
          text="Send Reset Link"
          :loading="loading"
          loading-text="Sending..."
        />
      </form>
    </div>
    <p class="mt-20 block text-center">
      Remember your password?
      <nuxt-link
        to="/auth/login"
        class="font-semibold text-secondary-500"
      >
        Login
      </nuxt-link>
    </p>
  </div>
</template>
