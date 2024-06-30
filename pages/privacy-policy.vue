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
  <div class="h-[100%] overflow-y-auto">
    <ContentDoc class="container prose-sm mb-16 mt-8 lg:mb-0 privacy-policy" />
  </div>
</template>
