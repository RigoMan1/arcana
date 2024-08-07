import { ref } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
  const showModal = ref(false);
  const errorMessage = ref('');

  nuxtApp.vueApp.config.globalProperties.$showErrorModal = (
    message: string
  ) => {
    errorMessage.value = message;
    showModal.value = true;
  };

  nuxtApp.vueApp.config.errorHandler = (error: any, instance, info) => {
    nuxtApp.vueApp.config.globalProperties.$showErrorModal(
      error.message || 'An unexpected error occurred'
    );
  };

  nuxtApp.hook('vue:error', (error: any, instance, info) => {
    nuxtApp.vueApp.config.globalProperties.$showErrorModal(
      error.message || 'An unexpected error occurred'
    );
  });

  return {
    provide: {
      showModal,
      errorMessage,
    },
  };
});
