import { defineStore } from 'pinia';
import { spreads } from '@/constants/tarot-spreads';

interface TarotSpreadState {
  activeSpreadIndex: number;
}

export const useTarotSpread = defineStore('spread-select-store', {
  state: (): TarotSpreadState => ({
    activeSpreadIndex: 0,
  }),
  getters: {
    activeSpread(): ITarotSpreadObject {
      return spreads[this.activeSpreadIndex];
    },
  },
});
