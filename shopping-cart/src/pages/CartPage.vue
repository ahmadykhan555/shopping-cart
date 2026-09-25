<template>
  <div>
    <div v-if="!isFetching" class="flex items-start gap-24">
      <p v-if="!cartItems.length">No items in cart</p>
      <div v-else class="min-w-0 flex-1">
        <div
          class="w-full min-w-0 md:grid md:grid-cols-[minmax(0,1fr)_7rem_8rem_7rem] md:gap-x-6 max-h-[calc(100vh-20rem)] overflow-y-auto"
        >
          <CartItemsColumnHeaders />
          <CartItem
            v-for="(item, idx) in cartItems"
            :key="idx"
            :item="item"
            :updateItemQuantity="
              (id, quantity) => updateItemQuantity(id, quantity)
            "
          />
        </div>
        <CartActions @addItem="addItemToCart" @clearCart="clearCart" />
      </div>
      <div class="sticky top-16 max-md:flex-1 md:w-125">
        <CartSummary :summary="summary" />
      </div>
    </div>
    <div v-else>Fetching cart items...</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import useCart from "@/composables/useCart";
import CartItem from "@/components/cart/CartItem.vue";
import CartSummary from "@/components/cart/CartSummary.vue";
import CartItemsColumnHeaders from "@/components/cart/CartItemsColumnHeaders.vue";
import CartActions from "@/components/cart/CartActions.vue";
const {
  cartItems,
  summary,
  fetchCartItems,
  isFetching,
  addItemToCart,
  clearCart,
  updateItemQuantity,
} = useCart();

onMounted(() => {
  if (!isFetching.value && !cartItems.value.length) {
    // only fetch if not already fetching and no items in cart
    fetchCartItems();
  }
});
</script>
