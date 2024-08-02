<script setup lang="ts">
import { useForm } from 'vee-validate';
import { string, object } from 'yup';

const props = defineProps<{
  title: string;
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  type?: 'register' | 'login';
}>();

const buttonText = props.type === 'register' ? 'Register' : 'Sign In';
const loadingText =
  props.type === 'register' ? 'Signing up...' : 'Signing in...';

const state = reactive({
  loading: false,
  errorMessage: '',
});

const { handleSubmit } = useForm({
  validationSchema: object({
    email: string().required().email(),
    password: string().required(),
  }),
});

const submitForm = handleSubmit(async (values: any) => {
  state.loading = true;
  state.errorMessage = '';
  try {
    await props.onSubmit(values);
  } catch (error: unknown) {
    if (error instanceof Error) {
      state.errorMessage = error.message;
    } else {
      state.errorMessage = 'An unknown error occurred';
    }
  } finally {
    state.loading = false;
  }
});

const supabase = useSupabaseClient();

async function continueWithGoogle() {
  state.loading = true;
  try {
    if (props.type === 'register') {
      const { error } = await supabase.auth.linkIdentity({
        provider: 'google',
      });
      if (error) throw new Error(error.message);
    } else {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      state.errorMessage = error.message;
    } else {
      state.errorMessage = 'An unknown error occurred';
    }
  } finally {
    state.loading = false;
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl text-center">{{ title }}</h1>
    <v-alert
      v-if="state.errorMessage"
      color="danger"
      class="mt-8"
    >
      {{ state.errorMessage }}
    </v-alert>
    <form
      class="mt-8"
      @submit.prevent="submitForm"
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
        class="mt-6"
      >
        <template
          v-if="props.type === 'login'"
          #labelHint
        >
          <nuxt-link
            to="/auth/reset-password"
            class="text-sm font-semibold text-secondary-500"
          >
            Forgot password?
          </nuxt-link>
        </template>
      </VeeTextField>
      <arcana-button
        type="submit"
        class="mt-8 w-full"
        :text="buttonText"
        :loading="state.loading"
        :loading-text="loadingText"
        :disabled="state.loading"
      />
    </form>
    <arcana-button
      color="none"
      class="mt-8 w-full !bg-white !text-blue-800 !font-bold"
      text="Continue with Google"
      :loading="state.loading"
      :loading-text="loadingText"
      :disabled="state.loading"
      @click="continueWithGoogle"
    />
  </div>
</template>
