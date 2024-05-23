import { defineStore } from 'pinia';
import { labels } from '@/constants/tarot-spreads';

interface TarotSpreadState {
  activeSpreadIndex: number;
}

export const useTarotSpread = defineStore('spread-select-store', {
  state: (): TarotSpreadState => ({
    activeSpreadIndex: 0,
  }),
  getters: {
    activeSpread(): { name: string; labels: string[] } {
      return {
        name: Object.keys(labels)[this.activeSpreadIndex],
        labels: labels[Object.keys(labels)[this.activeSpreadIndex]],
      };
    },
  },
});
