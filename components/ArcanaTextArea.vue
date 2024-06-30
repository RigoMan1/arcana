<script setup lang="ts">
const emit = defineEmits(['message']);
// Resize the textarea based on its content
const inputEl = ref<HTMLTextAreaElement>();
function autoGrow() {
  inputEl.value!.style.height = 'inherit'; // Reset height to recalculate
  inputEl.value!.style.height = `${inputEl.value!.scrollHeight}px`;
}

onMounted(() => autoGrow());

const throttledAutoGrow = useThrottleFn(autoGrow, 100);

const message = ref('');

function sendMessage() {
  if (message.value) {
    emit('message', message.value);

    message.value = '';

    inputEl.value!.style.height = 'inherit';
  }
}

function handleEnterKey(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // Prevent the default action to avoid inserting a new line

    sendMessage();
  }
}
</script>

<template>
  <div class="flex items-center py-1 px-2 rounded-lg bg-primary-800 w-full">
    <textarea
      id="chat"
      ref="inputEl"
      v-model="message"
      rows="1"
      class="block p-2.5 w-full text-sm text-primary-900 bg-white rounded-lg
        border-primary-300 focus:ring-secondary-500 focus:border-secondary-500
        dark:bg-primary-800 dark:border-primary-600 dark:placeholder-primary-400
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
      @click="sendMessage"
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
  @apply opacity-50 text-primary-300;
}
</style>
