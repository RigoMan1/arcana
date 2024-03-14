<script setup lang="ts">
import { testPrompt } from '@/constants/systemPrompts';
const { chatCompletion } = useChatgpt();

const props = defineProps<{
  cards: any;
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
      <button
        class="arcana-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-10
          rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
        @click="handleClick"
      >
        Reveal Your Fate
      </button>
    </div>

    <!-- is typing effect -->
    <div class="text-pane-bg p-12 border-8 border-amber-950/25 rounded-2xl">
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

.arcana-button {
  background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 100%
    ),
    url('path_to_your_parchment_texture_image');
  border: 4px solid goldenrod;
  text-shadow: 1px 1px 2px black;
  position: relative;
  overflow: hidden;
  font-size: 18px;
}

.arcana-button::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 1px solid rgba(255, 215, 0, 0.6);
  pointer-events: none; /* Ignore mouse events */
}

.arcana-button:hover::before {
  border-color: rgba(255, 215, 0, 0.8);
}

.arcana-button:active {
  transform: scale(0.98); /* Slightly shrink when clicked */
  background-color: #3b82f6; /* Darker blue to simulate a press effect */
}

.text-pane-bg {
  background-color: rgb(26, 17, 13);
  background-image: url('../public/images/parchment-dark.jpg');
}

/* --- */
</style>
