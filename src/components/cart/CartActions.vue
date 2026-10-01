<template>
  <div
    class="flex flex-wrap justify-between gap-4 px-4 py-4 rounded-md shadow-sm"
  >
    <AppButton
      variant="secondary"
      aria-label="Add item to cart"
      data-testid="cart-add-item-button"
      @click="$emit('addItem')"
      :disabled="disableAddButton"
    >
      Add item
    </AppButton>
    <AppButton
      aria-label="Clear cart"
      data-testid="cart-clear-button"
      :disabled="disableClearButton"
      variant="danger"
      @click="$emit('clearCart')"
    >
      Clear Cart
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import AppButton from "../base/AppButton.vue";

withDefaults(
  defineProps<{
    disableAddButton?: boolean;
    disableClearButton?: boolean;
  }>(),
  {
    disableAddButton: false,
    disableClearButton: false,
  },
);
defineEmits(["addItem", "clearCart"]);
</script>
