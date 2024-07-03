<script setup lang="ts">
definePageMeta({ layout: 'auth' });

const { data } = await useAsyncData(`content-privacy-policy`, () =>
  queryContent('privacy-policy').findOne()
);

if (!data.value) {
  throw new Error('404');
}
</script>

<template>
  <div class="h-[100%] overflow-y-auto px-8 py-16">
    <ContentDoc class="container prose-sm lg:mb-0 privacy-policy" />
  </div>
</template>
