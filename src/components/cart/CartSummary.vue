<template>
  <div class="rounded-xl border border-gray-200 bg-gray-50/50 max-md:p-4 p-6">
    <AppButton
      aria-label="Toggle order summary"
      v-if="collapsible"
      type="button"
      variant="ghost"
      class="flex w-full items-center justify-between gap-2 text-left text-gray-900"
      :aria-expanded="!isCollapsed"
      aria-controls="cart-summary-panel"
      @click="toggleCollapsed"
    >
      <span class="text-lg font-semibold">Order summary</span>
      <span class="text-sm font-normal text-gray-500" aria-hidden="true">
        {{ isCollapsed ? "Show" : "Hide" }}
      </span>
    </AppButton>
    <h2 v-else class="mb-5 text-lg font-semibold text-gray-900">
      Order summary
    </h2>

    <div
      v-if="collapsible && isCollapsed"
      class="mt-3 flex items-center justify-between border-t border-gray-200 pt-3"
    >
      <span class="text-sm text-gray-600">Total</span>
      <span class="text-base font-semibold tabular-nums text-gray-900">
        {{ formatMoney(summary.total) }}
      </span>
    </div>

    <div
      v-show="!collapsible || !isCollapsed"
      id="cart-summary-panel"
      :class="collapsible ? 'mt-5' : ''"
    >
      <div class="flex flex-col">
        <CartSummaryItem
          v-for="item in summaryItems"
          :key="item.label"
          :emphasis="item.label === 'Total'"
        >
          <template #label>{{ item.label }}</template>
          <template #value>{{ item.value }}</template>
        </CartSummaryItem>
      </div>

      <AppButton
        class="mt-2 w-full py-3"
        variant="secondary"
        aria-label="Proceed to checkout"
        data-testid="cart-checkout-button"
        :disabled="isCheckoutDisabled"
        @click="handleCheckout"
      >
        Proceed To Checkout
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatMoney } from "@/utils";
import { computed, ref } from "vue";
import AppButton from "../base/AppButton.vue";
import CartSummaryItem from "./CartSummaryItem.vue";
import type { CartSummary, CheckoutSuccessHistoryState } from "@/types";
import { STANDARD_TAX_RATE } from "@/consts";

const props = withDefaults(
  defineProps<{
    summary: CartSummary;
    isFetching?: boolean;
    collapsible?: boolean;
    initialCollapsed?: boolean;
  }>(),
  {
    isFetching: false,
    collapsible: false,
    initialCollapsed: true,
  },
);

const isCollapsed = ref(props.initialCollapsed);

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value;
};

const emit = defineEmits<{
  "click:checkout": [navigationState: CheckoutSuccessHistoryState];
}>();

const summaryItems = computed(() => [
  {
    label: "Subtotal",
    value: formatMoney(props.summary.subTotal),
  },
  {
    label: "Shipping",
    value: formatMoney(props.summary.shippingCost),
  },
  {
    label: `Tax (${STANDARD_TAX_RATE * 100}%)`,
    value: formatMoney(props.summary.tax),
  },
  {
    label: "Total",
    value: formatMoney(props.summary.total),
  },
]);

const handleCheckout = () => {
  const itemCount = props.summary.count;
  if (itemCount < 1) {
    return;
  }

  emit("click:checkout", {
    itemCount,
    orderSummary: {
      itemCount,
      subtotal: props.summary.subTotal,
      shipping: props.summary.shippingCost,
      tax: props.summary.tax,
      total: props.summary.total,
    },
  });
};

const isCheckoutDisabled = computed(
  () => props.isFetching || !props.summary.subTotal,
);
</script>
