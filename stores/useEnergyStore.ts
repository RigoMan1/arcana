import { defineStore } from 'pinia';

export const useEnergyStore = defineStore('energy-store', {
  state: () => ({
    basicEnergy: 12,
    cosmicEnergy: 3,
  }),
  actions: {
    addBasicEnergy(amount: number) {
      this.basicEnergy += amount;
      this.checkForConversion();
    },
    addCosmicEnergy(amount: number) {
      this.cosmicEnergy += amount;
    },
    checkForConversion() {
      if (this.basicEnergy >= 100) {
        const conversionAmount = Math.floor(this.basicEnergy / 100);
        this.basicEnergy -= conversionAmount * 100;
        this.cosmicEnergy += conversionAmount;
      }
    },
    useBasicEnergy(amount: number) {
      if (amount <= this.basicEnergy) {
        this.basicEnergy -= amount;
      } else {
        const shortfall = amount - this.basicEnergy;
        const requiredCosmicEnergy = Math.ceil(shortfall / 100);
        if (requiredCosmicEnergy <= this.cosmicEnergy) {
          this.cosmicEnergy -= requiredCosmicEnergy;
          // Convert the required cosmic energy to basic energy
          this.basicEnergy += requiredCosmicEnergy * 100;
          // Now use the basic energy as initially intended
          this.basicEnergy -= amount;
        } else {
          return false; // Not enough energy in either form
        }
      }
      return true; // Energy use was successful
    },
    useCosmicEnergy(amount: number) {
      if (amount <= this.cosmicEnergy) {
        this.cosmicEnergy -= amount;
        return true;
      } else {
        return false; // Not enough cosmic energy
      }
    },
  },
});
