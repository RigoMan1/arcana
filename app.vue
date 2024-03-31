<script setup lang="ts"></script>

<template>
  <div class="arcana-scrollbar h-screen">
    <arcana-navbar />

    <div class="flex flex-col main">
      <nuxt-page />
    </div>
  </div>
</template>

<style>
.main {
  height: calc(100vh - 81px);
}
</style>
