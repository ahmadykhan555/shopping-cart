import { computed, readonly, ref } from "vue";
import type { CartItem, CartSummary } from "@/types";
import {
  STANDARD_TAX_RATE,
  FETCH_CART_ITEMS_URL,
  ADD_ITEM_TO_CART_URL,
  MAX_CART_ITEMS,
  DUMMY_CART_ITEM_UNIT_PRICE,
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
    totalWithTax: Number((total + tax).toFixed(2)),
  };
});

export default function useCart() {
  const { apiCall } = useApi();
  const { success } = useToast();

  // methods
  const fetchCartItems = async () => {
    isFetching.value = true;
    try {
      await apiCall<{ products: CartItem[] }>({
        url: FETCH_CART_ITEMS_URL,

        onSuccess: (rawResponse) => {
          cartItems.value = rawResponse.products.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            description: item.description,
            category: item.category,
            images: item.images,
            quantity: item.quantity ?? 1,
          }));
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      isFetching.value = false;
    }
  };

  const addItemToCart = async (item: Omit<CartItem, "id">) => {
    debugger;
    await apiCall<CartItem>({
      url: ADD_ITEM_TO_CART_URL,
      options: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, id: undefined }),
      },
      onSuccess: (item) => {
        cartItems.value.push({ ...item, quantity: item.quantity ?? 1 });
        success(`"${item.title}" added to cart`);
      },
    });
  };

  const removeItemFromCart = (id: number) => {
    cartItems.value = cartItems.value.filter((item) => item.id !== id);
  };

  const clearCart = () => (cartItems.value = []);

  const updateItemQuantity = (id: number, quantity: number) => {
    cartItems.value = cartItems.value.map((item) =>
      item.id === id ? { ...item, quantity } : item,
    );
  };

  return {
    summary: readonly(summary),
    cartItems: readonly(cartItems),
    isFetching: readonly(isFetching),
    fetchCartItems,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    updateItemQuantity,
  };
}
