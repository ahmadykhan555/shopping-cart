<template>
  <div>
    <div v-if="!isFetching && cartItems.length" class="flex items-start gap-24">
      <div>
        <div
          class="md:grid md:grid-cols-[minmax(0,1fr)_6rem_8rem_6rem] md:gap-x-6 gap-y-8 max-h-[calc(100vh-20rem)] overflow-y-auto"
        >
          <CartItemsColumnHeaders class="sticky top-0 bg-white" />
          <CartItem
            v-for="item in cartItems"
            :key="item.id"
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
    <div v-else>No items in cart</div>
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
  fetchCartItems();
});
</script>
