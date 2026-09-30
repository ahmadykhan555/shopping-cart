<template>
  <header class="flex items-center justify-between gap-12">
    <RouterLink
      class="inline-flex items-center"
      :to="{ name: 'cart' }"
      aria-label="Neuffer"
    >
      <img
        :src="logo"
        alt="Fensterversand"
        class="h-4 w-auto md:h-5"
        data-testid="site-logo"
      />
    </RouterLink>
    <RouterLink
      class="relative flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      active-class="!font-semibold !text-gray-900"
      :to="{ name: 'cart' }"
    >
      <span
        v-if="cartItems.length"
        class="absolute -right-1 -top-2.5 min-w-5 rounded-full bg-emerald-600 px-1.5 py-0.5 text-center text-[10px] font-semibold leading-none text-white"
      >
        {{ cartItems.length }}
      </span>
      <span class="hidden md:inline">Cart</span>
      <CartIcon class="size-6" />
    </RouterLink>
  </header>
</template>

<script setup lang="ts">
import logo from "@/assets/logo.svg";
import CartIcon from "@/assets/icons/CartIcon.vue";
import useCart from "@/composables/useCart";

const { cartItems } = useCart();
</script>
