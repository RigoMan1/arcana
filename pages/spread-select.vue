<script setup lang="ts">
import { useTarotSpread } from '~/stores/useTarotSpread';
import { spreads } from '@/constants/tarot-spreads';
import { useEnergyStore } from '@/stores/useEnergyStore';
import type { VSlideControls } from '~/modules/sui/runtime/components/VSlides/VSlides.vue';

const spreadStore = useTarotSpread();
const { activeSpread } = storeToRefs(useTarotSpread());

const BASE_COST_PER_CARD = 60;
const DISCOUNT_PER_CARD = 25;

const spreadCost = computed(() => {
  const numCards = activeSpread.value.positions.length;
  // Apply a discount that increases with the number of cards
  const discount = numCards > 1 ? DISCOUNT_PER_CARD * (numCards - 1) : 0;
  const totalCost = BASE_COST_PER_CARD * numCards - discount;
  return totalCost;
});

const energyStore = useEnergyStore();
async function handleClick() {
  try {
    await energyStore.useBasicEnergy(spreadCost.value);
    navigateTo('/tarot-reading');
  } catch (error) {
    console.error(error);
  }
}

const slides = ref<VSlideControls>();

// #region unlockable spreads
const user = useSupabaseUser();

const SPREAD_COST = 150;
const FREE_SPREADS = ['single-card-draw', 'three-card-cluster'];

async function unlockSpread(spreadId: string | number) {
  try {
    await energyStore.useBasicEnergy(SPREAD_COST);

    await $fetch(`/api/unlock-spread`, {
      method: 'POST',
      query: {
        userId: user.value?.id,
        spreadId,
      },
    });

    unlockedSpreads.value.push(spreadId);

    showConfirmDialog.value = false;
  } catch (error) {
    console.error(error);
  }
}

const unlockedSpreads = ref([...FREE_SPREADS]) as any;
const purchasedSpreads = (await $fetch('/api/unlocked-spreads', {
  method: 'GET',
  query: { userId: user.value?.id },
})) as Array<string | number>;

unlockedSpreads.value.push(...purchasedSpreads);

const isUnlocked = computed(() => {
  return unlockedSpreads.value.includes(
    spreads[spreadStore.activeSpreadIndex].id
  );
});

const showConfirmDialog = ref(false);
// #endregion
</script>

<template>
  <div>
    <alert-dialog
      v-model="showConfirmDialog"
      :title="`Unlock ${spreadStore.activeSpread.name}`"
      color="success"
      icon="fluent:lock-open-32-filled"
      secondary-action-text="Cancel"
      primary-action-text="Unlock"
      @click:secondary-action="showConfirmDialog = false"
      @click:primary-action="unlockSpread(spreadStore.activeSpread.id)"
    >
      Do you want to unlock

      <strong>{{ spreadStore.activeSpread.name }}</strong
      >?

      <br />

      This will require

      <nuxt-img
        class="w-3.5 rounded-full inline mr-1"
        src="/images/energy-basic.png"
        alt=""
      />

      <span class="text-blue-300">
        {{ SPREAD_COST }}
      </span>

      energy.
    </alert-dialog>

    <div class="px-4 pb-2 flex flex-col h-full justify-around">
      <div>
        <h1 class="text-center text-surface-200 text-xl">Choose your spread</h1>
      </div>

      <v-slides
        ref="slides"
        v-model="spreadStore.activeSpreadIndex"
      >
        <v-slide
          v-for="spread in spreads"
          :key="spread.name"
          class="h-[75vh]"
        >
          <spread-card
            :class="{ grayscale: !isUnlocked }"
            :spread-cost="spreadCost"
          />
        </v-slide>

        <!-- prev/next -->
        <div class="flex w-full absolute left-0 px-2 top-[calc(15vw+5vh)]">
          <arcana-button
            :disabled="!slides?.canMoveBack"
            variant="text"
            class="!px-4"
            @click="slides?.prev"
          >
            <Icon
              name="fluent:chevron-left-16-filled"
              size="1.5em"
            />
          </arcana-button>

          <div class="flex-1" />

          <arcana-button
            :disabled="!slides?.canMoveForward"
            variant="text"
            @click="slides?.next"
          >
            <Icon
              name="fluent:chevron-right-16-filled"
              size="1.5em"
            />
          </arcana-button>
        </div>
      </v-slides>

      <arcana-button
        v-if="isUnlocked"
        class="w-3/4 self-center"
        text="Select"
        @click="handleClick"
      />

      <arcana-button
        v-else
        class="w-3/4 self-center"
        @click="showConfirmDialog = true"
      >
        <Icon
          name="fluent:lock-open-32-filled"
          size="1.5em"
          class="no-gray mr-2"
        />
        <span>Unlock</span>
      </arcana-button>
    </div>
  </div>
</template>
