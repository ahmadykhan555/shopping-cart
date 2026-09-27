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
          {{ item.value }}
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
import useCart from "@/composables/useCart";
import AppButton from "../base/AppButton.vue";
import CartSummaryItem from "./CartSummaryItem.vue";
import useTotalWithShippingCost from "@/composables/useTotalWithShippingCost";

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
