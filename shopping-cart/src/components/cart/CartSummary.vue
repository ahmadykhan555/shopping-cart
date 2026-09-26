<template>
  <div class="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
    <h2 class="mb-5 text-lg font-semibold text-gray-900">Order summary</h2>

    <div class="flex flex-col">
      <CartSummaryItem
        v-for="(item, index) in summaryItems"
        :key="item.label"
        :emphasis="item.label === 'Total'"
      >
        <template #label>{{ item.label }}</template>
        {{ item.value }}
      </CartSummaryItem>
    </div>

    <AppButton
      class="mt-2 w-full py-3"
      variant="secondary"
      :disabled="isCheckoutDisabled"
      @click="handleCheckout"
    >
      Checkout
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "@/composables/useToast";
import { formatMoney } from "@/utils";
import { computed } from "vue";
import useCart from "@/composables/useCart";
import AppButton from "../base/AppButton.vue";
import CartSummaryItem from "./CartSummaryItem.vue";
import useTotalWithShippingCost from "@/composables/useTotalWithShippingCost.ts";

const { success } = useToast();
const { isFetching, summary } = useCart();
const { totalWithoutShippingCost, totalWithShippingCost, shippingCost } =
  useTotalWithShippingCost();

const summaryItems = computed(() => [
  {
    label: "Subtotal",
    value: formatMoney(summary.value.total),
  },
  {
    label: "Shipping",
    value: formatMoney(shippingCost.value),
  },
  {
    label: "Tax",
    value: formatMoney(summary.value.tax),
  },
  {
    label: "Total",
    value: formatMoney(
      shippingCost.value
        ? totalWithShippingCost.value
        : totalWithoutShippingCost.value,
    ),
  },
]);

const handleCheckout = () => {
  success("Proceeding to checkout…");
};

const isCheckoutDisabled = computed(
  () => isFetching.value || !summary.value.total,
);
</script>
