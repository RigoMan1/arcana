<script setup lang="ts">
const { chatCompletion } = useChatgpt();

const props = defineProps<{
  cards: IThreeCardClusterSpread;
  allCardsSelected: boolean;
  prompt: {
    user: string;
    system: string;
  };
}>();

const formattedSpread = computed(() => {
  if (!props.allCardsSelected) return;

  const formatCard = (position: string, card: TarotCard) =>
    `${position}: ${card.name}`;

  const { past, future, present } = props.cards;
  if (!past || !future || !present) return;
  return [
    formatCard('Past', past),
    formatCard('Present', present),
    formatCard('Future', future),
  ].join('\n');
});

const chatTree = ref([]) as Ref<IMessage[]>;
const fortuneTellerMessages = computed(() =>
  chatTree.value.filter((m) => m.role === 'assistant')
);

const isTyping = ref(false);

async function sendMessage() {
  if (!props.cards) return;
  try {
    if (props.prompt.user.trim() === '') return; // Avoid sending empty messages

    const userMessage: IMessage = {
      role: 'user',
      content: `
      ${props.prompt.user}
      <tarot-spread-${props.cards.name}>
        ${formattedSpread.value}
      </tarot-spread-${props.cards.name}>
      `,
    };

    const systemMessage: IMessage = {
      role: 'system',
      content: props.prompt.system,
    };

    chatTree.value.push(userMessage);
    // props.prompt.user = ''; // clear input
    isTyping.value = true;

    const responseMessage = (await chatCompletion([
      systemMessage,
      ...chatTree.value,
    ])) as IMessage;

    isTyping.value = false;

    chatTree.value.push(responseMessage);
  } catch (error) {
    alert(error);
  }
}

const emit = defineEmits(['reveal-fortune', 'next-step']);
function handleClick() {
  sendMessage();
  emit('reveal-fortune');
}

const showContinueButton = ref(true);
// go to next step and hide the continue button
function handleNextStep() {
  emit('next-step');
  showContinueButton.value = false;
}
</script>

<template>
  <div>
    <arcana-button
      v-show="!fortuneTellerMessages.length"
      :disabled="!allCardsSelected || isTyping"
      class="block mx-auto mt-12"
      @click="handleClick"
    >
      <template v-if="!allCardsSelected"> Pick 3 Cards </template>
      <template v-if="isTyping"> Awaiting Fortune </template>
      <template v-if="allCardsSelected && !isTyping"> Reveal Fortune </template>
    </arcana-button>

    <!-- is typing effect -->
    <div
      v-if="fortuneTellerMessages.length > 0 || isTyping"
      class="bg-parchment-dark p-12 border-8 border-amber-950/25 rounded-2xl max-h-[800px]
        overflow-y-auto mt-12"
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

    <arcana-button
      v-if="fortuneTellerMessages.length > 0 && showContinueButton"
      class="mt-12 block mx-auto"
      @click="handleNextStep"
    >
      Continue
    </arcana-button>
  </div>
</template>
