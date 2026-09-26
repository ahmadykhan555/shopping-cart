<template>
  <article
    class="w-full min-w-0 border-b border-gray-100 py-6 md:col-span-full md:grid md:grid-cols-subgrid md:items-center"
  >
    <div class="flex min-w-0 items-center gap-4">
      <img
        :src="item.image"
        :alt="item.title"
        class="h-20 w-20 shrink-0 rounded-md object-cover"
      />
      <div>
        <h3 class="min-w-0 text-base font-medium leading-snug text-gray-900">
          {{ item.title }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 line-clamp-2">
          {{ item.description }}
        </p>
      </div>
    </div>
    <p class="text-base font-medium tabular-nums text-gray-900">
      {{ formatMoney(item.price) }}
    </p>
    <QuantitySelector
      class="justify-self-start self-center"
      :quantity="item.quantity"
      @update:quantity="updateItemQuantity(item.id, $event)"
    />
    <p class="text-right text-base font-medium tabular-nums text-gray-900">
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
