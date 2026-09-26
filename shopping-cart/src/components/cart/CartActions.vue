<template>
  <div class="mt-8 flex flex-wrap justify-between gap-4">
    <AppButton variant="secondary" @click="$emit('addItem')">
      Add item
    </AppButton>
    <AppButton variant="danger" @click="$emit('clearCart')">
      Clear Cart
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import AppButton from "../base/AppButton.vue";
defineEmits(["addItem", "clearCart"]);
</script>
