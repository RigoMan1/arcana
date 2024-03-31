import { defineStore } from 'pinia';
const { chatCompletion } = useChatgpt();

export const useChatgptStore = defineStore('chatgpt-store', () => {
  const chatTree = ref([]) as Ref<IMessage[]>;

  const isTyping = ref(false);

  function setIsTyping(value: boolean) {
    isTyping.value = value;
  }

  async function sendMessage(prompt: ITarotPrompt) {
    if (prompt.user.trim() === '') return; // Avoid sending empty messages
    try {
      setIsTyping(true);

      const userMessage: IMessage = {
        role: 'user',
        content: prompt.user,
      };

      const systemMessage: IMessage = {
        role: 'system',
        content: prompt.system,
      };

      chatTree.value.push(userMessage);

      const responseMessage = (await chatCompletion([
        systemMessage,
        ...chatTree.value,
      ])) as IMessage;

      chatTree.value.push(responseMessage);

      setIsTyping(false);
      return responseMessage;
    } catch (error) {
      setIsTyping(false);
      alert(error);
    }
  }

  return {
    isTyping,
    sendMessage,
  };
});
