<script setup lang="ts">
const emit = defineEmits(['message', 'toggleCards']);

const message = ref('');

function handleEnterKey(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // Prevent the default action to avoid inserting a new line

    emit('message', message.value);

    message.value = '';
  }
}

// Resize the textarea based on its content
const inputEl = ref<HTMLTextAreaElement>();
function autoGrow() {
  inputEl.value!.style.height = 'inherit'; // Reset height to recalculate
  inputEl.value!.style.height = `${inputEl.value!.scrollHeight}px`;
}

onMounted(() => autoGrow());

const throttledAutoGrow = useThrottleFn(autoGrow, 100);
</script>

<template>
  <div class="flex items-center py-2 px-3 rounded-full bg-primary-900">
    <button
      type="button"
      class="p-2 text-primary-500 rounded-lg cursor-pointer hover:text-primary-900
        hover:bg-primary-100 dark:text-primary-400 dark:hover:text-white
        dark:hover:bg-primary-600"
      @click="emit('toggleCards')"
    >
      <svg
        class="w-6 h-6"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <title>cards-playing</title>
        <path
          d="M14.7 2.2H16.2C17.3 2.2 18.2 3.1 18.2 4.2V10.6L14.7 2.2M20.1 3.8L21.4 4.4C22.4 4.8 22.9 6 22.5 7L20.1 12.9V3.8M18 15.5L13 3.5C12.7 2.7 12 2.3 11.2 2.3C10.9 2.3 10.7 2.4 10.4 2.5L3 5.5C2 5.9 1.5 7 2 8L7 20C7.3 20.8 8 21.2 8.8 21.2C9.1 21.2 9.3 21.2 9.6 21L17 18C17.8 17.7 18.2 17 18.2 16.2C18.1 16 18.1 15.7 18 15.5M11.4 15L8.2 12.6L8.6 8.6L11.8 11L11.4 15"
        />
      </svg>
    </button>
    <textarea
      id="chat"
      ref="inputEl"
      v-model="message"
      rows="1"
      class="block mx-4 p-2.5 w-full text-sm text-primary-900 bg-white rounded-lg
        border-primary-300 focus:ring-secondary-500 focus:border-secondary-500
        dark:bg-primary-900 dark:border-primary-600 dark:placeholder-primary-400
        dark:text-white dark:focus:ring-secondary-500 dark:focus:border-secondary-500
        resize-none outline-none max-h-40 overflow-y-auto"
      placeholder="Your message..."
      @keydown.enter="handleEnterKey"
      @input="throttledAutoGrow"
    />
    <button
      :class="{ 'button--disabled': !message }"
      class="inline-flex justify-center p-2 text-secondary-600 rounded-full cursor-pointer
        hover:bg-secondary-100 dark:text-secondary-500 dark:hover:bg-primary-600"
      @click="emit('message', message)"
    >
      <svg
        class="w-6 h-6 rotate-90"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<style>
.button--disabled {
  @apply opacity-50 pointer-events-none text-primary-300;
}
</style>
