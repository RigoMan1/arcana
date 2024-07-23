import { defineStore } from 'pinia';

export const useEnergyStore = defineStore('energy-store', {
  state: () => ({
    basicEnergy: 0,
    showLowEnergyAlert: false,
  }),
  actions: {
    async initializeEnergy() {
      try {
        const user = useSupabaseUser();
        if (user.value?.id) {
          const response = (await $fetch(
            `/api/energy-balance?userId=${user.value.id}`
          )) as any;

          if (response.error) {
            throw new Error(response.error);
          } else {
            this.basicEnergy = response.energyBalance;
          }
        }
      } catch (error) {
        console.error('Error initializing energy:', error);
        throw new Error('Failed to initialize energy.');
      }
    },
    async addBasicEnergy(amount: number) {
      if (!Number.isInteger(amount) || amount < 0) {
        throw new Error('Amount to add must be a positive integer.');
      }

      try {
        const user = useSupabaseUser();
        const response = (await $fetch('/api/energy-update', {
          method: 'POST',
          body: {
            userId: user.value?.id,
            amount,
            action: 'add',
          },
        })) as any;

        if (response.error) {
          throw new Error(response.error);
        } else {
          this.basicEnergy += amount;

          return true;
        }
      } catch (error) {
        console.error('Error updating energy:', error);
        throw new Error('Failed to add energy.');
      }
    },
    async useBasicEnergy(amount: number) {
      if (!Number.isInteger(amount)) {
        throw new Error('Amount to use must be a non-negative integer.');
      }
      if (!this.isEnergyAvailable(amount)) {
        this.showEnergyAlert();
        throw new Error('Insufficient energy.');
      }

      try {
        const user = useSupabaseUser();
        const response = (await $fetch('/api/energy-update', {
          method: 'POST',
          body: {
            userId: user.value?.id,
            amount,
            action: 'deduct',
          },
        })) as any;

        if (response.error) {
          throw new Error(response.error);
        } else {
          this.basicEnergy -= amount;
        }
      } catch (error) {
        console.error('Error updating energy:', error);
        throw new Error('Failed to use energy.');
      }
    },
    showEnergyAlert() {
      this.showLowEnergyAlert = true;
    },
    closeEnergyAlert() {
      this.showLowEnergyAlert = false;
    },
  },
  getters: {
    isEnergyAvailable: (state) => (amount: number) =>
      state.basicEnergy >= amount,
  },
});
