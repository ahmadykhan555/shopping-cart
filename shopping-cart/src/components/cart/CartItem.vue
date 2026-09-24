<template>
  <article
    class="w-full min-w-0 border-b border-gray-200 py-8 md:col-span-full md:grid md:grid-cols-subgrid md:items-center"
  >
    <div class="flex min-w-0 items-start gap-4">
      <img
        :src="item.image"
        :alt="item.title"
        class="h-16 w-16 shrink-0 object-cover"
      />
      <h3 class="min-w-0 text-sm font-medium text-gray-900 md:text-base">
        {{ item.title }}
      </h3>
    </div>
    <p class="tabular-nums text-gray-900">{{ formatMoney(item.price) }}</p>
    <QuantitySelector
      :quantity="item.quantity"
      @update:quantity="updateItemQuantity(item.id, $event)"
    />
    <p class="tabular-nums text-gray-900">
      {{ formatMoney(item.price * item.quantity) }}
    </p>
  </article>
</template>
<script setup lang="ts">
import type { CartItem } from "@/types";
import { formatMoney } from "@/utils";
import QuantitySelector from "./QuantitySelector.vue";

defineProps<{
  item: CartItem;
  updateItemQuantity: (id: number, quantity: number) => void;
}>();
</script>
