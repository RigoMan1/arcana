import { defineStore } from 'pinia';
const { chatCompletion } = useChatgpt();

export const useChatgptStore = defineStore('chatgpt-store', {
  state: () => ({
    chatTree: [] as IMessage[],
    isTyping: false,
  }),
  actions: {
    setIsTyping(value: boolean) {
      this.isTyping = value;
    },
    async sendMessage(prompt: ITarotPrompt) {
      if (prompt.user.trim() === '') return; // Avoid sending empty messages
      try {
        this.setIsTyping(true);

        const userMessage: IMessage = {
          role: 'user',
          content: prompt.user,
        };

        const systemMessage: IMessage = {
          role: 'system',
          content: prompt.system,
        };

        this.chatTree.push(userMessage);

        const responseMessage = (await chatCompletion([
          systemMessage,
          ...this.chatTree,
        ])) as IMessage;

        this.chatTree.push(responseMessage);

        this.setIsTyping(false);
        return responseMessage;
      } catch (error) {
        this.setIsTyping(false);
        alert(error);
      }
    },
  },
});
