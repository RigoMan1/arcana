<script setup lang="ts">
const emit = defineEmits(['message']);

const message = ref('');

function handleEnterKey(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // Prevent the default action to avoid inserting a new line

    emit('message', message.value);

    message.value = '';
  }
}
</script>

<template>
  <div>
    <label
      for="chat"
      class="sr-only"
    >
      Your message
    </label>
    <div
      class="flex items-center py-2 px-3 bg-zinc-50 rounded-lg dark:bg-zinc-700"
    >
      <button
        type="button"
        class="p-2 text-zinc-500 rounded-lg cursor-pointer hover:text-zinc-900
          hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white
          dark:hover:bg-zinc-600"
      >
        <svg
          class="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
      <textarea
        id="chat"
        v-model="message"
        rows="1"
        class="block mx-4 p-2.5 w-full text-sm text-zinc-900 bg-white rounded-lg border
          border-zinc-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800
          dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white
          dark:focus:ring-indigo-500 dark:focus:border-indigo-500 resize-none"
        placeholder="Your message..."
        @keydown.enter="handleEnterKey"
      ></textarea>
      <button
        class="inline-flex justify-center p-2 text-indigo-600 rounded-full cursor-pointer
          hover:bg-indigo-100 dark:text-indigo-500 dark:hover:bg-zinc-600"
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
  </div>
</template>
