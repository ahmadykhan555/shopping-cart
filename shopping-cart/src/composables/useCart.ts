import { computed, ref } from "vue";
import type { CartItem, CartSummary } from "@/types";
import {
  STANDARD_TAX_RATE,
  FETCH_CART_ITEMS_URL,
  ADD_ITEM_TO_CART_URL,
  FETCH_ITEM_BY_ID_URL,
} from "@/consts";
import useApi from "./useApi";

export default function useCart() {
  const { apiCall } = useApi();
  // data
  const cartItems = ref<CartItem[]>([]);
  const isFetching = ref(false);
  const summary = computed<CartSummary>(() => {
    const total = cartItems.value.reduce((acc, item) => acc + item.price, 0);
    const tax = total * STANDARD_TAX_RATE;
    return {
      total: Number(total.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      count: cartItems.value.length,
      shippingCost: 0,
      totalWithTax: Number((total + tax).toFixed(2)),
    };
  });

  // methods
  const fetchCartItems = async () => {
    isFetching.value = true;
    const rawCartItems = await apiCall<CartItem[]>(FETCH_CART_ITEMS_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    cartItems.value = rawCartItems.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      description: item.description,
      category: item.category,
      image: item.image,
      quantity: item.quantity ?? 1,
    }));
    isFetching.value = false;
  };

  const addItemToCart = async (item: CartItem) => {
    const response = await apiCall<{ id: number }>(ADD_ITEM_TO_CART_URL, {
      method: "POST",
      body: JSON.stringify(item),
    });

    if (response.id) {
      const addedItem = await apiCall<CartItem>(
        FETCH_ITEM_BY_ID_URL(response.id),
      );

      if (addedItem) {
        cartItems.value.push(addedItem);
      }
    }
  };

  const removeItemFromCart = async (id: number) => {
    cartItems.value = cartItems.value.filter((item) => item.id !== id);
  };

  const clearCart = () => (cartItems.value = []);

  return {
    summary,
    cartItems,
    isFetching,
    fetchCartItems,
    addItemToCart,
    removeItemFromCart,
    clearCart,
  };
}
