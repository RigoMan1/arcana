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
  <content-renderer
    v-if="message.content"
    class="w-full markdown prose prose-sm text-center"
    :value="parsedContent"
    style="z-index: 10"
  />
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

.fortune-oracle {
  @apply rounded-full text-indigo-100 h-full flex items-center;
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(57, 58, 88, 0.5) 0%,
    rgba(20, 21, 47, 0.1) 100%
  );
}
</style>
