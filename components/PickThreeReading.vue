<script setup lang="ts">
const themeQuestions = [
  'How can I advance my career?',
  'What’s trying to come forth in my life?',
  'How can I move my love life forward',
];

const emit = defineEmits(['select-question']);
const selectedIndex = ref<number | null>(null);
const selectQuestion = (questionIndex: number) => {
  selectedIndex.value = questionIndex;
  emit('select-question', themeQuestions[questionIndex]);
};
</script>

<template>
  <div>
    <h2 class="text-3xl font-bold text-center mb-8">
      Pick one question you'd like to explore
    </h2>
    <div class="grid grid-cols-3 gap-4 mt-8">
      <div
        v-for="(question, questionIndex) in themeQuestions"
        :key="question"
        class="text-center flex flex-col px-4 py-8 bg-zinc-900 rounded-lg shadow-md"
        :class="{
          'border-2 border-zinc-500': selectedIndex === questionIndex,
        }"
      >
        <p class="text-lg font-medium">{{ question }}</p>

        <div class="flex-1" />

        <arcana-button
          class="mt-8 block mx-auto"
          :disabled="selectedIndex !== null"
          :text="selectedIndex === questionIndex ? 'Selected' : 'Select'"
          @click="selectQuestion(questionIndex)"
        />
      </div>
    </div>
  </div>
</template>
