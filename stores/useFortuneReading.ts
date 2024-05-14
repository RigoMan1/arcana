import { defineStore } from 'pinia';
import { fortuneTellers } from '@/constants/fortune-tellers';

interface FortuneReadingState {
  fortuneInitiated: boolean;
  fortuneComplete: boolean;
  cardDrawn: boolean;
  activeFortuneTellerIndex: number;
}

export const useFortuneReading = defineStore('fortune-reading-store', {
  state: (): FortuneReadingState => ({
    fortuneInitiated: false,
    fortuneComplete: false,
    cardDrawn: false,
    activeFortuneTellerIndex: 0,
  }),
  actions: {
    initiateFortuneReading() {
      this.fortuneInitiated = true;
    },
    completeFortuneReading() {
      this.fortuneComplete = true;
    },
  },
  getters: {
    activeFortuneTeller(): IFortuneTeller {
      return fortuneTellers[this.activeFortuneTellerIndex];
    },
  },
});
