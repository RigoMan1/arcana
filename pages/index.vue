<script setup lang="ts">
import { useFortuneTeller } from '~/stores/useFortuneTeller';
import { fortuneTellers } from '@/constants/fortune-tellers';
import type { VSlideControls } from '~/modules/sui/runtime/components/VSlides/VSlides.vue';

const user = useSupabaseUser();

const fortuneTeller = useFortuneTeller();
const slides = ref<VSlideControls>();

const CHARACTER_COST = 200;
const FREE_CHARACTERS = [1, 2];

const energyStore = useEnergyStore();
async function unlockChar(characterId: string | number) {
  try {
    await energyStore.useBasicEnergy(CHARACTER_COST);

    await $fetch(`/api/unlock-character`, {
      method: 'POST',
      query: {
        userId: user.value?.id,
        characterId,
      },
    });

    unlockedCharacters.value.push(characterId);

    showConfirmDialog.value = false;
  } catch (error) {
    console.error(error);
  }
}

const unlockedCharacters = ref([...FREE_CHARACTERS]) as any;
const purchasedCharacters = (await $fetch('/api/unlocked-characters', {
  method: 'GET',
  query: { userId: user.value?.id },
})) as Array<string | number>;

unlockedCharacters.value.push(...purchasedCharacters);

// todo:🧹chore: refactor isUnlocked logic, consider using fortune teller store
const isUnlocked = computed(() => {
  return unlockedCharacters.value.includes(
    fortuneTellers[fortuneTeller.activeFortuneTellerIndex].id
  );
});

const showConfirmDialog = ref(false);
</script>

<template>
  <div class="px-4 pb-2 flex flex-col h-full justify-around">
    <alert-dialog
      v-model="showConfirmDialog"
      :title="`Unlock ${fortuneTeller.activeFortuneTeller.name}`"
      color="success"
      icon="fluent:lock-open-32-filled"
      secondary-action-text="Cancel"
      primary-action-text="Unlock"
      @click:secondary-action="showConfirmDialog = false"
      @click:primary-action="unlockChar(fortuneTeller.activeFortuneTeller.id)"
    >
      Do you want to unlock

      <strong>{{ fortuneTeller.activeFortuneTeller.name }}</strong
      >?

      <br />

      This will require

      <nuxt-img
        class="w-3.5 rounded-full inline mr-1"
        src="/images/energy-basic.png"
        alt=""
      />

      <span class="text-blue-300">
        {{ CHARACTER_COST }}
      </span>

      energy.
    </alert-dialog>

    <div>
      <h1 class="text-center text-surface-200 text-xl">Choose your reader</h1>
    </div>

    <v-slides
      ref="slides"
      v-model="fortuneTeller.activeFortuneTellerIndex"
    >
      <v-slide
        v-for="character in fortuneTellers"
        :key="character.name"
      >
        <fortune-teller-card
          :fortune-teller="character"
          :class="{ 'grayscale opacity-60 ': !isUnlocked }"
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

    <div class="flex items-center justify-center space-x-2">
      <v-item-group
        v-model="fortuneTeller.activeFortuneTellerIndex"
        class="flex space-x-2 overflow-x-auto"
        mandatory
      >
        <v-item-slot
          v-for="(character, characterIndex) in fortuneTellers"
          :key="character.name"
          v-slot="{ isSelected, toggle }"
          :value="characterIndex"
        >
          <v-button
            :class="{
              'opacity-25': !isSelected,
              grayscale: !unlockedCharacters.includes(character.id),
            }"
            class="rounded-xl overflow-hidden aspect-square h-[6vh] max-h-20 flex-shrink-0"
            @click="toggle"
          >
            <nuxt-img
              :src="character.image"
              alt="fortune teller"
              class="object-cover w-full h-full"
              placeholder
            />
          </v-button>
        </v-item-slot>
      </v-item-group>

      <arcana-button
        v-if="isUnlocked"
        to="/spread-select"
        variant="primary"
        class="!h-full aspect-square"
        size="none"
      >
        <Icon
          name="fluent:arrow-circle-right-16-regular"
          size="1.5em"
        />
      </arcana-button>

      <arcana-button
        v-else
        variant="primary"
        class="!h-full aspect-square"
        size="none"
        @click="showConfirmDialog = true"
      >
        <Icon
          name="fluent:lock-open-32-filled"
          size="1.5em"
          class="no-gray"
        />
      </arcana-button>
    </div>
  </div>
</template>
