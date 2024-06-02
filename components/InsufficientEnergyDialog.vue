<script setup lang="ts">
const alert = defineModel<boolean>();

const energyShop = ref(false);

function handleClick() {
  alert.value = false;
  energyShop.value = true;
}
</script>

<template>
  <div>
    <energy-shop-dialog v-model="energyShop" />

    <alert-dialog
      v-model="alert"
      color="error"
      title="Insufficient Energy"
      text="Energy too low to perform this action!"
      icon="fluent:error-circle-24-filled"
      secondary-action-text="Cancel"
      primary-action-text="Buy Energy +"
      @click:secondary-action="alert = false"
      @click:primary-action="handleClick"
    />
  </div>
</template>
