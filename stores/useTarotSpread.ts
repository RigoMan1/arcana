import { defineStore } from 'pinia';
import { spreads } from '@/constants/tarot-spreads';

interface TarotSpreadState {
  activeSpreadIndex: number;
  selectedCards: Record<string, any | null>;
  selectedSpread: ITarotSpreadObject | null;
}

export const useTarotSpread = defineStore('spread-select-store', {
  state: (): TarotSpreadState => ({
    activeSpreadIndex: 0,
    selectedCards: {},
    selectedSpread: null,
  }),
  actions: {
    initSpread() {
      const spread: Record<string, any | null> = {};
      const spreadLabels = this.activeSpread.positions;
      spreadLabels.forEach((pos) => {
        spread[pos.name] = null;
      });

      this.selectedCards = spread;
    },
    setActiveSpread(spread: ITarotSpreadObject) {
      this.selectedSpread = spread;
    },
  },
  getters: {
    activeSpread(): ITarotSpreadObject {
      return this.selectedSpread || spreads[this.activeSpreadIndex];
    },
    someCardsSelected(): boolean {
      return Object.values(this.selectedCards).some((card) => card !== null);
    },
    allCardsSelected(): boolean {
      return Object.values(this.selectedCards).every((card) => card !== null);
    },
  },
});
