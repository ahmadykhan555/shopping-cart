<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between px-1 py-2 border-b border-gray-200">
      <p>Subtotal</p>
      <p>{{ summary.total }}</p>
    </div>

    <div class="flex justify-between px-1 py-2 border-b border-gray-400">
      <p>Shipping</p>
      <p>{{ summary.shippingCost }}</p>
    </div>
    <div class="flex justify-between px-1 py-2 border-b border-gray-400">
      <p>Tax</p>
      <p>{{ summary.tax }}</p>
    </div>
    <div class="flex justify-between px-1 py-2">
      <p>Total</p>
      <p>{{ summary.totalWithTax }}</p>
    </div>

    <button class="bg-green-500 text-white px-4 py-2 rounded-md">
      Checkout
    </button>
  </div>
</template>

<script setup lang="ts">
import type { CartSummary } from "@/types";

const props = defineProps<{
  summary: CartSummary;
}>();
</script>
