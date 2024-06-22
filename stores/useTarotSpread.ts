import { defineStore } from 'pinia';
import { spreads } from '@/constants/tarot-spreads';

interface TarotSpreadState {
  activeSpreadIndex: number;
  selectedCards: Record<string, any | null>;
}

export const useTarotSpread = defineStore('spread-select-store', {
  state: (): TarotSpreadState => ({
    activeSpreadIndex: 0,
    selectedCards: {},
  }),
  actions: {
    initSpread() {
      const spread: Record<string, any | null> = {};
      const spreadLabels = this.activeSpread.labels;
      spreadLabels.forEach((label) => {
        spread[label] = null;
      });

      this.selectedCards = spread;
    },
  },
  getters: {
    activeSpread(): ITarotSpreadObject {
      return spreads[this.activeSpreadIndex];
    },
    someCardsSelected(): boolean {
      return Object.values(this.selectedCards).some((card) => card !== null);
    },
    allCardsSelected(): boolean {
      return Object.values(this.selectedCards).every((card) => card !== null);
    },
  },
});
