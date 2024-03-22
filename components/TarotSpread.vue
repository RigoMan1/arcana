<script setup lang="ts">
import { generateId } from '~/utils/helpers';
const props = defineProps<{
  tarotDeck: TarotCard[] | null[];
  spread: string;
  prompt: ITarotPrompt;
}>();

const uniqueZoneId = generateId();

const emit = defineEmits(['remove-card', 'all-cards-selected', 'next-step']);

const handleCardSelect = (
  cardName: string,
  spreadLabel: ThreeCardClusterSlots
) => {
  // 1. find card in deck
  const cardIndex = props.tarotDeck.findIndex(
    (card) => card?.name === cardName
  );
  if (cardIndex === -1) return;

  // 2. update selected cards
  const foundCard = props.tarotDeck[cardIndex];
  selectedCards.value[spreadLabel] = foundCard;

  // 3. remove card from deck
  emit('remove-card', cardIndex);
};

const labels = {
  'universal-guidance-spread': ['energy', 'theme', 'challenge', 'opportunity'],
  'three-card-cluster': ['past', 'present', 'future'],
} as Record<string, string[]>;

const currentLabels = computed(() => labels[props.spread]);

const createSpread = (spreadLabels: string[]) => {
  const spread: Record<string, any | null> = {
    name: props.spread,
    options: spreadLabels,
  };
  spreadLabels.forEach((label) => {
    spread[label] = null;
  });
  return spread;
};

const selectedCards = ref(createSpread(currentLabels.value));

const allCardsSelected = computed(() => {
  return Object.values(selectedCards.value).every((card) => card !== null);
});

watch(allCardsSelected, (newVal) => {
  if (newVal) emit('all-cards-selected');
});

const flipCards = ref(false);
const revealCards = () => (flipCards.value = true);

// --- fortune reading logic ---

import { useChatgptStore } from '~/stores/useChatgptStore';
const { sendMessage } = useChatgptStore();

const fortuneMessage = ref([]) as Ref<IMessage[]>;
const isTyping = ref(false);
async function handleClick() {
  isTyping.value = true;

  const res = await sendMessage(props.prompt, selectedCards.value);
  if (res) fortuneMessage.value.push(res);

  isTyping.value = false;
  revealCards();
}

const showContinueButton = ref(true);
function handleNextStep() {
  emit('next-step');
  showContinueButton.value = false;
}
</script>

<template>
  <div>
    <div class="flex space-x-2 max-w-[640px] mx-auto">
      <drop-zone
        v-for="label in currentLabels"
        :key="label"
        :label="label"
        :zone-id="`zone-${label}-${uniqueZoneId}`"
        class="border border-zinc-500 relative p-4 flex-1 rounded-lg"
        @drop="handleCardSelect"
      >
        <draggable-tarot-card
          v-if="selectedCards[label]"
          :card="selectedCards[label]!"
          :flip="flipCards"
        />
      </drop-zone>
    </div>

    <div>
      <arcana-button
        v-show="!fortuneMessage.length"
        :disabled="!allCardsSelected || isTyping"
        class="block mx-auto mt-12"
        @click="handleClick"
      >
        <template v-if="!allCardsSelected"> Pick 3 Cards </template>
        <template v-if="isTyping"> Awaiting Fortune </template>
        <template v-if="allCardsSelected && !isTyping">
          Reveal Fortune
        </template>
      </arcana-button>

      <!-- is typing effect -->
      <div
        v-if="fortuneMessage.length || isTyping"
        class="bg-parchment-dark border-8 border-amber-950/25 rounded-2xl overflow-y-auto mt-12"
      >
        <fortune-reader-message
          v-for="message in fortuneMessage"
          :key="message.content.slice(0, 10)"
          :content="message.content"
          :is-typing="isTyping"
          class="my-4 p-12"
        />

        <p
          v-if="isTyping"
          class="text-white p-12 rounded-lg mt-2 text-center"
        >
          <span class="animate-pulse">
            Preparing your insights; breathe deeply and embrace the forthcoming
            wisdom.
          </span>
        </p>
      </div>

      <arcana-button
        v-if="fortuneMessage.length > 0 && showContinueButton"
        class="mt-12 block mx-auto"
        @click="handleNextStep"
      >
        Continue
      </arcana-button>
    </div>
  </div>
</template>
