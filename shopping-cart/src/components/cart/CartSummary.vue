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
import { formatMoney } from "@/utils";
import { computed } from "vue";
import { useRouter } from "vue-router";
import useCart from "@/composables/useCart";
import AppButton from "../base/AppButton.vue";
import CartSummaryItem from "./CartSummaryItem.vue";
import useTotalWithShippingCost from "@/composables/useTotalWithShippingCost";

const router = useRouter();
const { isFetching, summary, cartItems, clearCart } = useCart();
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
  const itemCount = cartItems.value.length;
  if (itemCount < 1) {
    return;
  }

  const total = shippingCost.value
    ? totalWithShippingCost.value
    : totalWithoutShippingCost.value;

  void router.push({
    path: "/checkout/success",
    state: {
      itemCount,
      orderSummary: {
        itemCount,
        subtotal: summary.value.total,
        shipping: shippingCost.value,
        tax: summary.value.tax,
        total,
      },
    },
  });
  clearCart();
};

const isCheckoutDisabled = computed(
  () => isFetching.value || !summary.value.total,
);
</script>
