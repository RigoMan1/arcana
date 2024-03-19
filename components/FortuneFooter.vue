<script setup lang="ts"></script>

<template>
  <div class="flex gap-4">
    <div class="bg-zinc-900/50 rounded-lg shadow p-2 text-center w-1/3">
      <h3 class="text-xl font-semibold mb-2">In-App Rewards</h3>
      <p>You've unlocked the following rewards:</p>
    </div>

    <div class="bg-zinc-900/50 rounded-lg shadow p-2 text-center w-1/3">
      <h3 class="text-xl font-semibold mb-2">Share Your Reading</h3>
      <!-- <p>
        Share your tarot reading with friends and family to spread the wisdom
        and insight you've gained.
      </p> -->
      <div class="flex justify-center mt-4">
        <arcana-button
          text="Share"
          class="!py-2 !text-sm"
        />
      </div>
    </div>

    <div class="bg-zinc-900/50 rounded-lg shadow p-2 text-center w-1/3">
      <h3 class="text-xl font-semibold mb-2">Rate Our App</h3>
      <!-- <p>
        We'd love to hear your feedback! Rate our app and let us know how we can
        improve your experience.
      </p> -->
      <div class="flex justify-center mt-4">
        <arcana-button
          text="Rate"
          class="!py-2 !text-sm"
        />
      </div>
    </div>
  </div>
</template>
