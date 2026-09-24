<template>
  <div class="mt-12 flex justify-between">
    <button
      class="bg-green-500 text-white px-4 py-2 rounded-md mr-4"
      @click="$emit('addItem')"
    >
      Add item
    </button>
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded-md"
      @click="$emit('clearCart')"
    >
      Clear Cart
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits(["addItem", "clearCart"]);
</script>
