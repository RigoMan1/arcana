import { defineStore } from 'pinia';
const { chatCompletion } = useChatgpt();

export const useChatgptStore = defineStore('chatgpt-store', () => {
  // ui chat tree
  const chatTree = ref([]) as Ref<IMessage[]>;
  const fullChatTree = ref([]) as Ref<IMessage[]>;

  const isTyping = ref(false);

  function setIsTyping(value: boolean) {
    isTyping.value = value;
  }

  async function sendMessage(
    prompt: ITarotPrompt,
    addToChatTree: boolean = true
  ) {
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

      if (addToChatTree) chatTree.value.push(userMessage);
      fullChatTree.value.push(userMessage);

      const responseMessage = (await chatCompletion([
        systemMessage,
        ...fullChatTree.value,
      ])) as IMessage;

      chatTree.value.push(responseMessage);
      fullChatTree.value.push(responseMessage);

      setIsTyping(false);
      return responseMessage;
    } catch (error) {
      setIsTyping(false);
      alert(error);
    }
  }

  return {
    chatTree,
    isTyping,
    sendMessage,
  };
});
