<template>
  <header class="flex gap-12 items-center justify-between">
    <RouterLink active-class="font-semibold" to="/">Home</RouterLink>
    <RouterLink
      active-class="font-semibold"
      to="/cart"
      class="relative flex items-center gap-2"
    >
      <span
        v-if="cartItems.length"
        class="absolute -top-3 right-0 text-xs text-emerald-600"
        >{{ cartItems.length }}</span
      >
      <span class="hidden md:block">Cart</span>
      <CartIcon class="size-6" />
    </RouterLink>
  </header>
</template>

<script setup lang="ts">
import CartIcon from "@/assets/icons/CartIcon.vue";
import useCart from "@/composables/useCart";

const { cartItems } = useCart();
</script>
