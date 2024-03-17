import { defineStore } from 'pinia';
const { chatCompletion } = useChatgpt();

export const useChatgptStore = defineStore('chatgpt-store', () => {
  const formattedSpread = (cards: any) => {
    const formatCard = (position: string, card: TarotCard) =>
      `${position}: ${card.name}`;

    const spread = Object.entries(cards).map(([position, card]) => {
      if (position === 'name' || position === 'options') return '';
      return formatCard(position, card);
    });

    return spread.join('\n');
  };

  const chatTree = ref([]) as Ref<IMessage[]>;

  // todo:  create  prompt type
  async function sendMessage(prompt: ITarotPrompt, cards: any) {
    if (!cards) return;
    try {
      if (prompt.user.trim() === '') return; // Avoid sending empty messages

      const userMessage: IMessage = {
        role: 'user',
        content: `
      ${prompt.user}
      <tarot-spread-${cards.name}>
        ${formattedSpread(cards)}
      </tarot-spread-${cards.name}>
      `,
      };

      const systemMessage: IMessage = {
        role: 'system',
        content: prompt.system,
      };

      chatTree.value.push(userMessage);
      // prompt.user = ''; // clear input

      const responseMessage = (await chatCompletion([
        systemMessage,
        ...chatTree.value,
      ])) as IMessage;

      chatTree.value.push(responseMessage);

      return responseMessage;
    } catch (error) {
      alert(error);
    }
  }

  return {
    chatTree,
    sendMessage,
  };
});
