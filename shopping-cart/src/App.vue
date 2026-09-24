<script setup lang="ts">
import { onMounted } from "vue";
import AppHeader from "./components/AppHeader.vue";
</script>

<template>
  <div class="container mx-auto size-full">
    <AppHeader class="px-12 py-6 border-b border-gray-200" />
    <main>
      <RouterView class="p-12" />
    </main>
  </div>
</template>
