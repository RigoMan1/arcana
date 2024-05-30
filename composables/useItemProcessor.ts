import { ref } from 'vue';

export function useItemProcessor(items: any, callback: any) {
  const currentIndex = ref(0);
  const processing = ref(false);

  const startProcessing = () => {
    if (items.value.length === 0) {
      return;
    }
    processing.value = true;
    processNextItem();
  };

  const processNextItem = () => {
    if (!processing.value || currentIndex.value >= items.value.length) {
      processing.value = false;
      return;
    }

    callback(items.value[currentIndex.value], next);

    currentIndex.value++;
  };
  const next = () => processNextItem();

  const reset = () => {
    currentIndex.value = 0;
    processing.value = false;
  };

  return {
    startProcessing,
    next,
    reset,
    currentIndex,
    processing,
  };
}
