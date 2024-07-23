<script setup lang="ts">
import {
  PROMPT_BIO_QUERY,
  PROMPT_BIO_ASSESMENT,
} from '@/constants/systemPrompts';
const { handleTextMessage, handleSendMessage } = useFortuneTeller();
const fortuneTeller = useFortuneTeller();
const chatgpt = useChatgptStore();

onMounted(() => {
  handleTextMessage(PROMPT_BIO_QUERY, 0);
});

const { updateBio } = useProfileStore();
async function assesConversation() {
  const res = await handleSendMessage({
    systemPrompt: '',
    userPrompt: PROMPT_BIO_ASSESMENT,
    messageCost: 0,
  });

  if (res?.content) updateBio(res.content);

  navigateTo('/reader-select');
}
</script>

<template>
  <div class="p-4 flex h-full flex-col">
    <div
      v-if="chatgpt.isTyping"
      class="flex items-center justify-center h-1/6"
    >
      <span class="animate-pulse">
        {{ fortuneTeller.activeFortuneTeller.name }} is typing...
      </span>
    </div>

    <div class="flex-1" />

    <div>
      <arcana-text-area
        min-height="8rem"
        @message="handleTextMessage"
      />
    </div>

    <div class="flex mt-6 space-x-4">
      <arcana-button
        class="flex-1"
        text="Skip"
        variant="outlined"
        @click="handleTextMessage('skip')"
      />

      <arcana-button
        class="flex-1"
        text="Continue"
        @click="assesConversation"
      />
    </div>
  </div>
</template>
