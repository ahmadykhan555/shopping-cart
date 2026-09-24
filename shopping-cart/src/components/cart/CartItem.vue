<template>
  <article class="contents">
    <div class="flex items-start gap-12">
      <img :src="item.image" :alt="item.title" class="w-16 h-16 object-cover" />
      <h3>{{ item.title }}</h3>
    </div>
    <p>{{ formatMoney(item.price) }}</p>
    <QuantitySelector
      :quantity="item.quantity"
      @update:quantity="updateItemQuantity(item.id, $event)"
    />
    <p>{{ formatMoney(item.price * item.quantity) }}</p>
  </article>
</template>
<script setup lang="ts">
import type { CartItem } from "@/types";
import { formatMoney } from "@/utils";
import QuantitySelector from "./QuantitySelector.vue";

const props = defineProps<{
  item: CartItem;
  updateItemQuantity: (id: number, quantity: number) => void;
}>();
</script>
