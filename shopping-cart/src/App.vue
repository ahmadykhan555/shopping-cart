<script setup lang="ts">
import { Notivue, Notification } from "notivue";
import AppHeader from "./components/base/AppHeader.vue";
</script>

<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>

  <div class="container mx-auto size-full">
    <AppHeader class="border-b border-gray-200 px-12 py-6" />
    <main>
      <RouterView class="p-12" />
    </main>
  </div>
</template>
