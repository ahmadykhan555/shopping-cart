<script setup lang="ts">
import { Notivue, Notification } from "notivue";
import AppHeader from "./components/base/AppHeader.vue";
</script>

<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>

  <div class="container mx-auto min-h-screen">
    <AppHeader class="border-b border-gray-200 max-md:px-8 px-12 py-6" />
    <main>
      <RouterView class="max-md:px-8 max-md:py-6 p-12" />
    </main>
  </div>
</template>
