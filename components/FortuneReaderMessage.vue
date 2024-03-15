<script setup lang="ts">
import markdownParser from '@nuxt/content/transformers/markdown';

const props = defineProps<{
  content?: string;
  isTyping: boolean;
}>();

// @ts-ignore
const parsedContent =
  props.content && (await markdownParser.parse('md', props.content, {}));
</script>

<template>
  <div
    class="markdown light w-full break-words dark:prose-invert rounded-lg prose prose-lg
      dark"
  >
    <content-renderer
      v-if="content"
      :value="parsedContent"
    />
  </div>
</template>

<style>
.markdown.prose {
  max-width: 100%;
  text-align: center;
}

.markdown.prose a {
  text-decoration: none;
  @apply text-amber-200;
}

.markdown.prose h2,
.markdown.prose h3 {
  @apply text-amber-200;
}

.markdown.prose {
  @apply text-amber-100/85;
}
</style>
