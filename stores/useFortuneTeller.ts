import { defineStore } from 'pinia';
import { fortuneTellers } from '@/constants/fortune-tellers';

interface FortuneTellerState {
  activeFortuneTellerIndex: number;
}

export const useFortuneTeller = defineStore('reader-select-store', {
  state: (): FortuneTellerState => ({
    activeFortuneTellerIndex: 0,
  }),
  getters: {
    activeFortuneTeller(): IFortuneTeller {
      return fortuneTellers[this.activeFortuneTellerIndex];
    },
  },
});
