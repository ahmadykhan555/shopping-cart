<template>
  <article class="contents">
    <div class="flex items-start gap-12">
      <img :src="item.image" :alt="item.title" class="w-16 h-16 object-cover" />
      <h3>{{ item.title }}</h3>
    </div>
    <p>{{ item.price }}</p>
    <QuantitySelector
      :quantity="item.quantity"
      @update:quantity="handleQuantityUpdate($event)"
    />
    <p>{{ item.price * item.quantity }}</p>
  </article>
</template>
<script setup lang="ts">
import type { CartItem } from "@/types";
import QuantitySelector from "./QuantitySelector.vue";

const props = defineProps<{
  item: CartItem;
}>();

const handleQuantityUpdate = (quantity: number) => {
  console.log(quantity);
};
</script>
