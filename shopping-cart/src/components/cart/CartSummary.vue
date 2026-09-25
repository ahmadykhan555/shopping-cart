<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between px-1 py-2 border-b border-gray-200">
      <p>Subtotal</p>
      <p>{{ formatMoney(summary.total) }}</p>
    </div>

    <div class="flex justify-between px-1 py-2 border-b border-gray-400">
      <p>Shipping</p>
      <p>{{ formatMoney(summary.shippingCost) }}</p>
    </div>
    <div class="flex justify-between px-1 py-2 border-b border-gray-400">
      <p>Tax</p>
      <p>{{ formatMoney(summary.tax) }}</p>
    </div>
    <div class="flex justify-between px-1 py-2">
      <p>Total</p>
      <p>{{ formatMoney(summary.totalWithTax) }}</p>
    </div>

    <button
      :disabled="isCheckoutDisabled"
      type="button"
      :class="{ 'opacity-50 cursor-not-allowed': isCheckoutDisabled }"
      class="rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
      @click="handleCheckout"
    >
      Checkout
    </button>
  </div>
</template>

<script setup lang="ts">
import type { CartSummary } from "@/types";
import { useToast } from "@/composables/useToast";
import { formatMoney } from "@/utils";
import { computed } from "vue";
const props = defineProps<{
  summary: CartSummary;
}>();

const { success } = useToast();

const handleCheckout = () => {
  success("Proceeding to checkout…");
};

const isCheckoutDisabled = computed(() => {
  return props.isFetching || !props.summary.total;
});
</script>
