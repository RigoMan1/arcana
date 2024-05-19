<script setup lang="ts">
import { string } from 'yup';

definePageMeta({ layout: 'auth' });

useSeoMeta({ title: 'Login - Arcana' });

const { handleSubmit } = useForm({
  validationSchema: {
    email: string().required().email(),
    password: string().required(),
  },
});

const loading = ref(false);
const loginWithEmailAndPassword = handleSubmit(({ email, password }) => {
  console.log('email:', email);
  console.log('password:', password);
});
</script>

<template>
  <div
    class="mx-auto px-8 py-12 pb-16 sm:mt-12 sm:max-w-[490px] sm:rounded-xl sm:p-16
      sm:shadow-lg mt-20"
  >
    <div class="mx-auto max-w-[400px]">
      <h1 class="text-2xl text-center">Sign in</h1>

      <form
        class="mt-12"
        @submit="loginWithEmailAndPassword"
      >
        <VeeTextField
          name="email"
          label="Email"
          placeholder="Enter your email"
          autocomplete="email"
        />

        <VeeTextField
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          autocomplete="current-password"
          class="mt-4"
        >
          <template #labelHint>
            <nuxt-link
              to="reset-password"
              class="text-sm font-semibold text-secondary-500"
            >
              Forgot password?
            </nuxt-link>
          </template>
        </VeeTextField>

        <arcana-button
          size="small"
          class="mt-8 w-full"
          color="listcleanser"
          text="Sign In"
          loading-text="Signing in..."
          :loading="loading"
          block
        />
      </form>
    </div>
    <p class="mt-20 block text-center">
      Don’t have an account yet?
      <nuxt-link
        to="register"
        class="font-semibold text-secondary-500"
      >
        Sign up
      </nuxt-link>
    </p>
  </div>
</template>
