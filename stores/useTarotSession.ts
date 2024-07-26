import { defineStore } from 'pinia';
import TarotCards from '~/constants/tarot-card-data';
import { shuffleCards } from '@/utils/helpers';

interface FortuneReadingState {
  fortuneInitiated: boolean;
  fortuneComplete: boolean;
  cardDrawn: boolean;
  mode: 'chat' | 'read';
  hasUserInteracted: boolean;
  tarotDeck: any;
  selectedCardIndex: number | null;
}

export const useTarotSession = defineStore('fortune-reading-store', {
  state: (): FortuneReadingState => ({
    fortuneInitiated: false, // toggle after the user has asked a question?
    fortuneComplete: false, // toggle to show conclude reading?
    cardDrawn: false,
    hasUserInteracted: false,
    mode: 'chat',
    tarotDeck: shuffleCards(TarotCards, true),
    selectedCardIndex: null,
  }),
  actions: {
    initiateFortuneReading() {
      this.fortuneInitiated = true;
    },
    completeFortuneReading() {
      this.fortuneComplete = true;
    },
    toggleMode(newVal: 'chat' | 'read') {
      const { showMessage, hideMessage } = useFortuneTeller();

      if (newVal === 'chat') showMessage();
      else if (newVal === 'read') hideMessage();

      this.mode = newVal;
    },
    drawCard(wheelEl: any) {
      // if (!this.hasUserInteracted) return;
      this.toggleMode('read');
      this.cardDrawn = true;

      setTimeout(() => {
        wheelEl.spinCarousel();
      }, 400);
    },
    removeCard(cardIndex: number) {
      this.tarotDeck.splice(cardIndex, 1, null);
      this.selectedCardIndex = null;
    },
  },
});
