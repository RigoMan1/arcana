import { defineStore } from 'pinia';

export const useFortuneReading = defineStore('fortune-reading-store', {
  state: () => ({
    fortuneInitiated: false,
    fortuneComplete: false,
    cardDrawn: false,
  }),
  actions: {
    initiateFortuneReading() {
      this.fortuneInitiated = true;
    },
    completeFortuneReading() {
      this.fortuneComplete = true;
    },
  },
});
