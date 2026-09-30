<template>
  <div class="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
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
import { useRouter } from "vue-router";
import { useCart } from "@/composables";
import AppButton from "../base/AppButton.vue";
import CartSummaryItem from "./CartSummaryItem.vue";
import type { CheckoutSuccessHistoryState } from "@/types";
import { APP_ROUTES, STANDARD_TAX_RATE } from "@/consts";

const props = withDefaults(
  defineProps<{
    collapsible?: boolean;
    initialCollapsed?: boolean;
  }>(),
  {
    collapsible: false,
    initialCollapsed: true,
  },
);

const isCollapsed = ref(props.initialCollapsed);

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value;
};

const router = useRouter();
const { isFetching, summary, cartItems, emptyCart } = useCart();

const summaryItems = computed(() => [
  {
    label: "Subtotal",
    value: formatMoney(summary.value.subTotal),
  },
  {
    label: "Shipping",
    value: formatMoney(summary.value.shippingCost),
  },
  {
    label: `Tax (${STANDARD_TAX_RATE * 100}%)`,
    value: formatMoney(summary.value.tax),
  },
  {
    label: "Total",
    value: formatMoney(summary.value.total),
  },
]);

const handleCheckout = async () => {
  const itemCount = summary.value.count;
  if (itemCount < 1) {
    return;
  }

  const navigationState: CheckoutSuccessHistoryState = {
    itemCount,
    orderSummary: {
      itemCount,
      subtotal: summary.value.subTotal,
      shipping: summary.value.shippingCost,
      tax: summary.value.tax,
      total: summary.value.total,
    },
  };

  try {
    await router.push({
      path: APP_ROUTES.CHECKOUT_SUCCESS,
      state: navigationState,
    });
    emptyCart();
  } catch (error) {
    console.error(error);
  }
};

const isCheckoutDisabled = computed(
  () => isFetching.value || !summary.value.subTotal,
);
</script>
