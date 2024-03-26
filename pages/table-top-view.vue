<script setup lang="ts">
import TarotCards from '~/constants/tarot-card-data';

const tarotDeck = ref(TarotCards) as Ref<TarotCard[] | null[]>;

const shuffleCards = () => {
  let shuffled = [...TarotCards]; // Create a shallow copy to avoid modifying the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  tarotDeck.value = shuffled as TarotCard[];
};

onMounted(() => shuffleCards());

function removeCard(cardIndex: number) {
  tarotDeck.value.splice(cardIndex, 1, null);
}

// --- fortune reading logic ---

import { useChatgptStore } from '~/stores/useChatgptStore';
import {
  interactiveReaderPrompt,
  interactiveReaderCardReadingPrompt,
} from '@/constants/systemPrompts';
const { sendMessage, $state } = useChatgptStore();

const fortuneMessages = ref([]) as Ref<IMessage[]>;
const mostRecentMessage = ref('') as Ref<IMessage | null>;

async function handleSendMessage(prompt: string, userMessage: string) {
  mostRecentMessage.value = null; // Clear the most recent message

  const res = await sendMessage({
    system: prompt,
    user: userMessage,
  });

  if (res) {
    fortuneMessages.value.push(res); // Update the list of messages
    mostRecentMessage.value = res; // Update the most recent message
  }
}

async function handleClick(message: string) {
  await handleSendMessage(interactiveReaderPrompt, message);
}

async function handleSingleCardFortune(card: string) {
  const userMessage = `
    The user has drawn this card, for a 3 card cluster spread:
    ${card}
  `;
  await handleSendMessage(interactiveReaderCardReadingPrompt, userMessage);
}
</script>

<template>
  <div class="h-full flex flex-col justify-center container px-20">
    <fortune-teller-message
      v-if="mostRecentMessage && !$state.isTyping"
      :message="mostRecentMessage"
    />

    <div
      v-if="$state.isTyping"
      class="chat-bubble bg-teal-950 self-end animate-pulse"
    >
      Seeking insights... 🧙‍♂️
    </div>

    <div class="flex-1"></div>

    <tarot-spread
      :tarot-deck="tarotDeck"
      spread="three-card-cluster"
      class="mt-8"
      @remove-card="removeCard"
    />
    <div class="flex-1"></div>

    <fortune-reader-text-area
      class="mt-4 w-full"
      @message="handleClick"
    />
  </div>

  <div class="h-[400px]">
    <card-selection :tarot-deck="tarotDeck" />
  </div>
</template>

<style>
.chat-bubble {
  @apply p-4 rounded-lg shadow-md text-lg mt-4 max-w-md;
}
</style>
