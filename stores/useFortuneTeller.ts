import { defineStore } from 'pinia';
import { fortuneTellers } from '@/constants/fortune-tellers';
import { useEnergyStore } from '@/stores/useEnergyStore';
import { useChatgptStore } from '~/stores/useChatgptStore';
import { fortuneTellerPrompt } from '@/constants/systemPrompts';
import { PROMPT_BIO_ASSESMENT } from '@/constants/systemPrompts';

interface FortuneTellerState {
  activeFortuneTellerIndex: number;
  currentMessage: IMessage | null;
  displayMessage: boolean;
}

interface IFortuneTellerMessage {
  systemPrompt?: string;
  userPrompt: string;
  messageCost?: number;
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
    async handleSendMessage({
      systemPrompt,
      userPrompt,
      messageCost = 0,
    }: IFortuneTellerMessage) {
      this.clearCurrentMessage();

      const { useBasicEnergy } = useEnergyStore();
      const chatgpt = useChatgptStore();

      try {
        await useBasicEnergy(messageCost);

        return await chatgpt.sendMessage({
          system: systemPrompt || '',
          user: userPrompt,
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    async handleTextMessage({
      systemPrompt,
      userPrompt,
      messageCost = 0,
    }: IFortuneTellerMessage) {
      const messageCostComputed =
        messageCost !== undefined
          ? messageCost
          : Math.max(1, Math.ceil(userPrompt.length / 20));

      const res = await this.handleSendMessage({
        systemPrompt,
        userPrompt,
        messageCost: messageCostComputed,
      });
      if (res) this.setActiveMessage(res);
    },
    async assesConversation(systemPrompt: string) {
      const { updateBio } = useProfileStore();

      const res = await this.handleSendMessage({
        systemPrompt,
        userPrompt: PROMPT_BIO_ASSESMENT,
        messageCost: 0,
      });

      if (res?.content) updateBio(res.content);
    },
  },
  getters: {
    activeFortuneTeller(): IFortuneTeller {
      return fortuneTellers[this.activeFortuneTellerIndex];
    },
  },
});
