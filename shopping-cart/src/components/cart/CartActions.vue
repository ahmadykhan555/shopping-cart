<template>
  <div
    class="flex flex-wrap justify-between gap-4 px-4 py-4 rounded-md shadow-sm"
  >
    <AppButton
      variant="secondary"
      aria-label="Add item to cart"
      @click="$emit('addItem')"
      :disabled="isAddingItemToCart"
    >
      Add item
    </AppButton>
    <AppButton
      aria-label="Clear cart"
      :disabled="cartItems.length === 0"
      variant="danger"
      @click="$emit('clearCart')"
    >
      Clear Cart
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import useCart from "@/composables/useCart";
import AppButton from "../base/AppButton.vue";

defineEmits(["addItem", "clearCart"]);

const { cartItems, isAddingItemToCart } = useCart();
</script>
