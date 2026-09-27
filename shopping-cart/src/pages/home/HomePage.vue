<template>
  <div
    class="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 text-center"
  >
    <h1
      class="text-2xl font-semibold tracking-tight text-gray-900 md:text-4xl"
      data-testid="home-page-title"
    >
      Home
    </h1>

    <p
      v-if="cartItems.length"
      class="mt-4 max-w-md text-base text-gray-600 md:text-lg"
      data-testid="cart-items-count"
    >
      You have
      <span class="font-semibold text-gray-900">{{ cartItems.length }}</span>
      {{ cartItems.length === 1 ? "item" : "items" }} in your cart
    </p>
    <RouterLink
      v-if="cartItems.length"
      to="/cart"
      class="mt-8 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
    >
      <span>View cart</span>
      <ArrowRightIcon class="h-4 w-4" />
    </RouterLink>

    <template v-else>
      <p
        class="mt-4 max-w-md text-base text-gray-600 md:text-lg"
        data-testid="empty-cart-message"
      >
        Your cart is empty. Head to the cart to browse products.
      </p>
      <RouterLink
        to="/cart"
        class="mt-8 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-emerald-700"
      >
        <span>Go to cart</span>
        <ArrowRightIcon class="h-4 w-4" />
      </RouterLink>
    </template>
  </div>
</template>
<script setup lang="ts">
import ArrowRightIcon from "@/assets/icons/ArrowRightIcon.vue";
import useCart from "@/composables/useCart";

const { cartItems } = useCart();
</script>
