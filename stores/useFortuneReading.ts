import { defineStore } from 'pinia';

interface FortuneReadingState {
  fortuneInitiated: boolean;
  fortuneComplete: boolean;
  cardDrawn: boolean;
}

export const useFortuneReading = defineStore('fortune-reading-store', {
  state: (): FortuneReadingState => ({
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
