import { computed, ref } from "vue";
import type { CartItem, CartSummary } from "@/types";
import {
  STANDARD_TAX_RATE,
  FETCH_CART_ITEMS_URL,
  ADD_ITEM_TO_CART_URL,
  MAX_CART_ITEMS,
} from "@/consts";
import useApi from "./useApi";
import { createDummyCartItem } from "@/utils/cart";
import { useToast } from "./useToast";

// data
const cartItems = ref<CartItem[]>([]); // allows state sharing
const isFetching = ref(false);
const summary = computed<CartSummary>(() => {
  const total = cartItems.value.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = total * STANDARD_TAX_RATE;
  return {
    total: Number(total.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    count: cartItems.value.length,
    shippingCost: 0,
    totalWithTax: Number((total + tax).toFixed(2)),
  };
});

export default function useCart() {
  const { apiCall } = useApi();
  const { success } = useToast();

  // methods
  const fetchCartItems = async () => {
    isFetching.value = true;
    await apiCall<CartItem[]>(
      FETCH_CART_ITEMS_URL,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (rawCartItems) => {
        cartItems.value = rawCartItems.slice(0, MAX_CART_ITEMS).map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          description: item.description,
          category: item.category,
          image: item.image,
          quantity: item.quantity ?? 1,
        }));
      },
    );
    isFetching.value = false;
  };

  const addItemToCart = async () => {
    const newItem = createDummyCartItem(Date.now());

    await apiCall(
      ADD_ITEM_TO_CART_URL,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newItem.title,
          price: newItem.price,
        }),
      },
      () => {
        cartItems.value.push(newItem);
        success(`"${newItem.title}" added to cart`);
      },
    );
  };

  const removeItemFromCart = async (id: number) => {
    cartItems.value = cartItems.value.filter((item) => item.id !== id);
  };

  const clearCart = () => (cartItems.value = []);

  const updateItemQuantity = async (id: number, quantity: number) => {
    cartItems.value = cartItems.value.map((item) =>
      item.id === id ? { ...item, quantity } : item,
    );
  };

  return {
    summary,
    cartItems,
    isFetching,
    fetchCartItems,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    updateItemQuantity,
  };
}
