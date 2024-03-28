<script setup lang="ts">
import markdownParser from '@nuxt/content/transformers/markdown';

const props = defineProps<{
  message: IMessage;
}>();

// @ts-ignore
const parsedContent =
  props.message &&
  (await markdownParser.parse('md', props.message.content, {}));
</script>

<template>
  <parchment-sheet class="markdown prose prose-sm text-center">
    <content-renderer
      v-if="message.content"
      class="w-full"
      :value="parsedContent"
      style="z-index: 10"
    />
  </parchment-sheet>
</template>

<style>
.markdown.prose {
  max-width: 100%;
}

.markdown.prose a {
  text-decoration: none;
}

.markdown.prose p {
  font-size: 1rem;
}

.markdown.prose h2,
.markdown.prose h3 {
  @apply mt-6 mb-4;
}
</style>
