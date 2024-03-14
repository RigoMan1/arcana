<script setup lang="ts">
import { testPrompt } from '@/constants/systemPrompts';
const { chatCompletion } = useChatgpt();

const props = defineProps<{
  cards: any;
  allCardsSelected: boolean;
}>();

const maxChatHistoryLength = 5;
const chatHistory = computed(() => chatTree.value.slice(-maxChatHistoryLength));

const chatTree = ref([]) as Ref<IMessage[]>;
const fortuneTellerMessages = ref([]) as Ref<IMessage[]>;
const isTyping = ref(false);

function formatSpread(spread: any) {
  const formatCard = (position: string, card: TarotCard) =>
    // `${position}: ${card.name}, ${card.arcana.charAt(0).toUpperCase() + card.arcana.slice(1)} Arcana, ${card.suit.charAt(0).toUpperCase() + card.suit.slice(1)} Suit`;
    `${position}: ${card.name}`;

  return [
    'test',
    formatCard('Past', spread.past),
    formatCard('Present', spread.present),
    formatCard('Future', spread.future),
  ].join('\n');
}
const systemPrompt = ref(testPrompt);
const userInputText = ref(`I would like to know my fortune, please.`);

async function sendMessage() {
  if (!props.cards) return;
  try {
    if (userInputText.value.trim() === '') {
      return; // Avoid sending empty messages
    }

    const userMessage: IMessage = {
      role: 'user',
      content: `
      ${userInputText.value}
      <taror-spread-three-card-cluster>
        ${formatSpread(props.cards)}
      </taror-spread-three-card-cluster>
      `,
    };

    const systemMessage: IMessage = {
      role: 'system',
      content: systemPrompt.value,
    };

    chatTree.value.push(userMessage);

    userInputText.value = '';

    isTyping.value = true;

    const responseMessage = (await chatCompletion([
      systemMessage,
      ...chatHistory.value,
    ])) as IMessage;

    isTyping.value = false;

    chatTree.value.push(responseMessage);
    fortuneTellerMessages.value.push(responseMessage);
  } catch (error) {
    alert(error);
  }
}

const emit = defineEmits(['reveal-fortune']);
function handleClick() {
  sendMessage();
  emit('reveal-fortune');
}
</script>

<template>
  <div>
    <div class="flex justify-center mb-8">
      <arcana-button
        v-show="!fortuneTellerMessages.length"
        :disabled="!allCardsSelected || isTyping"
        @click="handleClick"
      >
        <template v-if="!allCardsSelected"> Pick 3 Cards </template>
        <template v-if="isTyping"> Awaiting Fortune </template>
        <template v-if="allCardsSelected && !isTyping">
          Reveal Fortune
        </template>
      </arcana-button>
    </div>

    <!-- is typing effect -->
    <div
      v-if="fortuneTellerMessages.length > 0 || isTyping"
      class="bg-parchment-dark p-12 border-8 border-amber-950/25 rounded-2xl"
    >
      <fortune-reader-message
        v-for="message in fortuneTellerMessages"
        :key="message.content.slice(0, 10)"
        :content="message.content"
        :is-typing="isTyping"
        class="my-4"
      />

      <p
        v-if="isTyping"
        class="text-white p-2 rounded-lg mt-2 text-center"
      >
        <span class="animate-pulse">
          Preparing your insights; breathe deeply and embrace the forthcoming
          wisdom.
        </span>
      </p>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');

html {
  font-family: 'Cinzel', serif;
}
</style>
