import { defineStore } from 'pinia';
import { fortuneTellers } from '@/constants/fortune-tellers';

interface FortuneTellerState {
  activeFortuneTellerIndex: number;
  currentMessage: IMessage | null;
  displayMessage: boolean;
}

export const useFortuneTeller = defineStore('reader-select-store', {
  state: (): FortuneTellerState => ({
    activeFortuneTellerIndex: 0,
    currentMessage: null,
    displayMessage: true,
  }),
  actions: {
    clearCurrentMessage() {
      this.currentMessage = null;
    },
    setActiveMessage(message: IMessage) {
      this.currentMessage = message;
    },
    hideMessage() {
      this.displayMessage = false;
    },
    showMessage() {
      this.displayMessage = true;
    },
  },
  getters: {
    activeFortuneTeller(): IFortuneTeller {
      return fortuneTellers[this.activeFortuneTellerIndex];
    },
  },
});
