<template>
  <div class="flex flex-wrap justify-between gap-4 px-4 py-4">
    <AppButton variant="secondary" @click="$emit('addItem')">
      Add item
    </AppButton>
    <AppButton
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

const { cartItems } = useCart();
</script>
