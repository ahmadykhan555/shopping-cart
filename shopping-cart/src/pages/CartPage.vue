<template>
  <div>
    <header class="mb-8 md:mb-10">
      <h1
        class="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl"
      >
        Your cart
      </h1>
      <p v-if="summary.count" class="mt-2 text-sm text-gray-600">
        {{ summary.count }}
        {{ summary.count === 1 ? "item" : "items" }}
      </p>
    </header>

    <CartLoadingState v-if="isFetching" />

    <div
      v-else
      class="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16"
    >
      <aside
        class="order-first w-full shrink-0 lg:order-2 lg:sticky lg:top-24 lg:w-80 xl:w-96"
      >
        <CartSummary
          collapsible
          :initial-collapsed="false"
          @click:checkout="handleCheckout"
        />
        <CartShippingCostCalculator
          class="mt-4 lg:mt-6"
          collapsible
          initial-collapsed
        />
      </aside>

      <div class="order-2 min-w-0 flex-1 lg:order-1">
        <div
          v-if="cartItems.length"
          class="relative max-h-[calc(100vh-20rem)] w-full min-w-0"
        >
          <div
            class="h-full max-h-[calc(100vh-20rem)] overflow-y-auto px-0.5 pb-19 md:grid md:grid-cols-[minmax(0,1fr)_7rem_8rem_7rem] md:gap-x-6"
          >
            <CartItemsColumnHeaders class="max-xl:hidden" />
            <CartItem
              v-for="item in cartItems"
              :key="item.id"
              :item="item"
              @updateItemQuantity="updateItemQuantity"
              @click:removeItem="removeItemFromCart"
            />
          </div>
          <CartActions
            class="absolute inset-x-0 bottom-0 z-10 bg-white/75 backdrop-blur-md"
            :disable-add-button="isAddingItemToCart"
            :disable-clear-button="cartItems.length === 0"
            @addItem="addDemoItemToCart"
            @clearCart="clearCart"
          />
        </div>
        <CartEmptyState v-else @addItem="addDemoItemToCart" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCart } from "@/composables";
import { APP_ROUTES } from "@/consts";
import type { CheckoutSuccessHistoryState } from "@/types";
import CartItem from "@/components/cart/CartItem.vue";
import CartSummary from "@/components/cart/CartSummary.vue";
import CartItemsColumnHeaders from "@/components/cart/CartItemsColumnHeaders.vue";
import CartActions from "@/components/cart/CartActions.vue";
import CartShippingCostCalculator from "@/components/cart/CartShippingCostCalculator.vue";
import CartLoadingState from "@/components/cart/CartLoadingState.vue";
import CartEmptyState from "@/components/cart/CartEmptyState.vue";

const {
  cartItems,
  summary,
  isFetching,
  hasInitializedCart,
  fetchCartItems,
  addDemoItemToCart,
  clearCart,
  updateItemQuantity,
  removeItemFromCart,
  isAddingItemToCart,
  emptyCart,
} = useCart();

const router = useRouter();

const handleCheckout = async (
  navigationState: CheckoutSuccessHistoryState,
) => {
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

onMounted(() => {
  if (isFetching.value || hasInitializedCart.value) return;
  fetchCartItems();
});
</script>
