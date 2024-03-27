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
  <parchment-sheet>
    <content-renderer
      v-if="message.content"
      class="w-full "
      :value="parsedContent"
      style="z-index: 10"
    />
  </parchment-sheet>
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
