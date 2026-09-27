<template>
  <div
    class="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-8"
  >
    <div class="w-full max-w-md text-center">
      <p class="text-4xl" aria-hidden="true">🎉</p>
      <h1
        class="mt-4 text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl"
      >
        Order placed!
      </h1>
      <p class="mt-4 text-base text-gray-600 md:text-lg">
        Thank you for your purchase. We’re processing
        <span class="font-semibold text-gray-900">{{ itemCount }}</span>
        {{ itemCount === 1 ? "item" : "items" }} from your cart.
      </p>
    </div>

    <div
      v-if="orderSummary"
      class="mt-8 w-full max-w-md rounded-xl border border-gray-200 bg-gray-50/50 p-6 text-left"
    >
      <h2 class="mb-5 text-lg font-semibold text-gray-900">Order summary</h2>
      <div class="flex flex-col">
        <CartSummaryItem
          v-for="row in summaryRows"
          :key="row.label"
          :emphasis="row.label === 'Total'"
        >
          <template #label>{{ row.label }}</template>
          {{ row.value }}
        </CartSummaryItem>
      </div>
    </div>

    <RouterLink
      to="/"
      class="mt-8 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-emerald-700"
    >
      Back to home
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import CartSummaryItem from "@/components/cart/CartSummaryItem.vue";
import type { CheckoutOrderSummary } from "@/types";
import { formatMoney } from "@/utils";
import confetti from "canvas-confetti";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

type CheckoutSuccessHistoryState = {
  itemCount?: number;
  orderSummary?: CheckoutOrderSummary;
};

const router = useRouter();
const itemCount = ref(0);
const orderSummary = ref<CheckoutOrderSummary | null>(null);

const summaryRows = computed(() => {
  if (!orderSummary.value) {
    return [];
  }

  const { subtotal, shipping, tax, total } = orderSummary.value;
  return [
    { label: "Subtotal", value: formatMoney(subtotal) },
    { label: "Shipping", value: formatMoney(shipping) },
    { label: "Tax", value: formatMoney(tax) },
    { label: "Total", value: formatMoney(total) },
  ];
});

onMounted(() => {
  const state = window.history.state as CheckoutSuccessHistoryState;
  const summary = state?.orderSummary;
  const count = state?.itemCount;

  if (
    !summary ||
    typeof count !== "number" ||
    count < 1 ||
    summary.itemCount !== count
  ) {
    void router.replace("/cart");
    return;
  }

  itemCount.value = count;
  orderSummary.value = summary;

  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.65 },
  });
});
</script>
