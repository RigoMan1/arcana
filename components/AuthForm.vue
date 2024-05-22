<script setup lang="ts">
import { useForm } from 'vee-validate';
import { string, object } from 'yup';

const props = defineProps<{
  title: string;
  buttonText: string;
  loadingText: string;
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  resetPasswordLink?: string;
}>();

const loading = ref(false);
const errorMessage = ref('');

const { handleSubmit } = useForm({
  validationSchema: object({
    email: string().required().email(),
    password: string().required(),
  }),
});

const submitForm = (
  submitFn: (values: { email: string; password: string }) => Promise<void>
) =>
  handleSubmit(async (values: any) => {
    loading.value = true;
    errorMessage.value = '';
    try {
      await submitFn(values);
    } catch (error: any) {
      errorMessage.value = error.message;
    } finally {
      loading.value = false;
    }
  });

const submit = submitForm(props.onSubmit);
</script>

<template>
  <div>
    <h1 class="text-2xl text-center">{{ title }}</h1>
    <v-alert
      v-if="errorMessage"
      color="error"
      class="mt-8"
      >{{ errorMessage }}</v-alert
    >
    <form
      class="mt-8"
      @submit="submit"
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
          v-if="props.resetPasswordLink"
          #labelHint
        >
          <nuxt-link
            :to="resetPasswordLink"
            class="text-sm font-semibold text-secondary-500"
            >Forgot password?</nuxt-link
          >
        </template>
      </VeeTextField>
      <arcana-button
        class="mt-8 w-full"
        :text="buttonText"
        :loading="loading"
        :loading-text="loadingText"
      />
    </form>
  </div>
</template>
