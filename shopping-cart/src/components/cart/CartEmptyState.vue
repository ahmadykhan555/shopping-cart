<template>
  <div
    class="flex min-h-[22rem] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-16 text-center"
  >
    <div
      class="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
      aria-hidden="true"
    >
      <CartIcon class="size-7" />
    </div>
    <h2 class="mt-5 text-lg font-semibold tracking-tight text-gray-900">
      Your cart is empty
    </h2>
    <p class="mt-2 max-w-sm text-sm leading-relaxed text-gray-600">
      Add a product to get started. Your items, quantities, and totals will show
      up here.
    </p>
    <AppButton
      class="mt-6 inline-flex items-center gap-2"
      variant="secondary"
      aria-label="Add item to cart"
      @click="$emit('addItem')"
    >
      Add item
      <ArrowRightIcon class="size-4" />
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import AppButton from "../base/AppButton.vue";
import CartIcon from "@/assets/icons/CartIcon.vue";
import ArrowRightIcon from "@/assets/icons/ArrowRightIcon.vue";

defineEmits(["addItem"]);
</script>
