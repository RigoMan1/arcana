<script setup lang="ts">
import { useNuxtApp } from '#app';

const { $showModal, $errorMessage } = useNuxtApp();

const showModal = ref($showModal);
const errorMessage = ref($errorMessage);

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <alert-dialog
    v-model="showModal"
    color="danger-alt"
    title="Arcana Error"
    :text="errorMessage"
    icon="fluent:error-circle-24-filled"
    primary-action-text="Close"
    @click:primary-action="closeModal"
  >
    
    
  </alert-dialog>
</template>
