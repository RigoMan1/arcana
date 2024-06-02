import { defineStore } from 'pinia';

export const useEnergyStore = defineStore('energy-store', {
  state: () => ({
    basicEnergy: 30, // Initializes with a default value
  }),
  actions: {
    addBasicEnergy(amount: number) {
      if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error('Amount to add must be a positive integer.');
      }
      this.basicEnergy += amount;
    },
    useBasicEnergy(amount: number) {
      if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error('Amount to use must be a positive integer.');
      }
      if (!this.isEnergyAvailable(amount)) {
        throw new Error('Insufficient energy.');
      }
      this.basicEnergy -= amount;
    },
  },
  getters: {
    isEnergyAvailable: (state) => (amount: number) =>
      state.basicEnergy >= amount,
  },
});
