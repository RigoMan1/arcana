<script setup lang="ts">
const energyShop = ref(false);

const { $state: $energyState, closeEnergyAlert } = useEnergyStore();

function handleClick() {
  closeEnergyAlert();
  energyShop.value = true;
}
</script>

<template>
  <div>
    <energy-shop-dialog v-model="energyShop" />

    <alert-dialog
      v-model="$energyState.isLowEnergyAlertVisible"
      color="danger"
      title="Insufficient Energy"
      text="Energy too low to perform this action!"
      icon="fluent:error-circle-24-filled"
      secondary-action-text="Cancel"
      primary-action-text="Buy Energy +"
      @click:secondary-action="closeEnergyAlert"
      @click:primary-action="handleClick"
    />
  </div>
</template>
