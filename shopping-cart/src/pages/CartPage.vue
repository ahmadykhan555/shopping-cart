<template>
  <div>
    <header class="mb-8 md:mb-10">
      <h1
        class="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl"
      >
        Your cart
      </h1>
      <p v-if="cartItems.length" class="mt-2 text-sm text-gray-600">
        {{ cartItems.length }}
        {{ cartItems.length === 1 ? "item" : "items" }}
      </p>
    </header>

    <div v-if="isFetching" class="py-12 text-sm text-gray-600">
      Loading cart…
    </div>

    <div
      v-else
      class="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16"
    >
      <aside
        class="order-first w-full shrink-0 lg:order-2 lg:sticky lg:top-24 lg:w-80 xl:w-96"
      >
        <CartSummary collapsible :initial-collapsed="false" />
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
            class="h-full max-h-[calc(100vh-20rem)] overflow-y-auto pb-[4.75rem] md:grid md:grid-cols-[minmax(0,1fr)_7rem_8rem_7rem] md:gap-x-6"
          >
            <CartItemsColumnHeaders class="max-md:hidden" />
            <CartItem
              v-for="item in cartItems"
              :key="item.id"
              :item="item"
              @click:updateItemQuantity="updateItemQuantity"
              @click:removeItem="removeItemFromCart"
            />
          </div>
          <CartActions
            class="absolute inset-x-0 bottom-0 z-10 bg-white/75 backdrop-blur-md"
            @addItem="addItemToCart(createDummyCartItem(cartItems.length + 1))"
            @clearCart="clearCart"
          />
        </div>
        <template v-else>
          <p class="py-12 text-sm text-gray-600">
            No items in cart. Use “Add item” to add products.
          </p>
          <CartActions
            class="mt-8"
            @addItem="addItemToCart(createDummyCartItem(cartItems.length + 1))"
            @clearCart="clearCart"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import useCart from "@/composables/useCart";
import CartItem from "@/components/cart/CartItem.vue";
import CartSummary from "@/components/cart/CartSummary.vue";
import CartItemsColumnHeaders from "@/components/cart/CartItemsColumnHeaders.vue";
import CartActions from "@/components/cart/CartActions.vue";
import CartShippingCostCalculator from "@/components/cart/CartShippingCostCalculator.vue";
import { createDummyCartItem } from "@/utils/cart.ts";

const {
  cartItems,
  fetchCartItems,
  isFetching,
  addItemToCart,
  clearCart,
  updateItemQuantity,
  removeItemFromCart,
} = useCart();

onMounted(() => {
  if (!isFetching.value && !cartItems.value.length) {
    fetchCartItems();
  }
});
</script>
