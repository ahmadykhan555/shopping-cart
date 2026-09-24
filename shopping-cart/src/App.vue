<script setup lang="ts">
import { onMounted } from "vue";
import AppHeader from "./components/AppHeader.vue";
</script>

<template>
  <div class="container mx-auto p-12 size-full">
    <AppHeader />
    <main>
      <RouterView />
    </main>
  </div>
</template>
