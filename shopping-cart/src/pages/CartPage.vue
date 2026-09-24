<template>
  <div>
    <div v-if="cartItems.length && !isFetching" class="flex items-start gap-24">
      <div>
        <CartItem v-for="item in cartItems" :key="item.id" :item="item" />
      </div>
      <div class="sticky top-16 max-md:flex-1 md:w-125">
        <CartSummary :summary="summary" />
      </div>
    </div>
    <div v-else>No items in cart</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import useCart from "@/composables/useCart";
import CartItem from "@/components/cart/CartItem.vue";
import CartSummary from "@/components/cart/CartSummary.vue";
const { cartItems, summary, fetchCartItems, isFetching } = useCart();

onMounted(() => {
  fetchCartItems();
});
</script>
