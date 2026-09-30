import { computed, readonly, ref } from "vue";
import type { CartItem, CartSummary } from "@/types";
import {
  STANDARD_TAX_RATE,
  FETCH_CART_ITEMS_URL,
  ADD_ITEM_TO_CART_URL,
} from "@/consts";
import useApi from "./useApi";
import useToast from "./useToast";

// data
const cartItems = ref<CartItem[]>([]); // allows state sharing
const isFetching = ref(false);
const hasInitializedCart = ref(false);
const summary = computed<CartSummary>(() => {
  const subTotal = cartItems.value.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subTotal * STANDARD_TAX_RATE;
  return {
    subTotal: Number(subTotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    count: cartItems.value.length,
    shippingCost: Number(shippingCost.value.toFixed(2)),
    total: Number((subTotal + tax + shippingCost.value).toFixed(2)),
  };
});
const shippingCost = ref(0);
const isAddingItemToCart = ref(false);

const getNextItemId = () => {
  return (
    cartItems.value.reduce(
      (maxId, cartItem) => Math.max(maxId, cartItem.id),
      0,
    ) + 1
  );
};

export default function useCart() {
  const { apiCall } = useApi();
  const { showSuccessToast } = useToast();

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
      hasInitializedCart.value = true;
    }
  };

  const addItemToCart = async (item: Omit<CartItem, "id">) => {
    if (isAddingItemToCart.value) return;
    isAddingItemToCart.value = true;
    try {
      await apiCall<CartItem>({
        url: ADD_ITEM_TO_CART_URL,
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, id: undefined }),
        },
        onSuccess: (item) => {
          cartItems.value.push({
            ...item,
            quantity: item.quantity ?? 1,
            id: getNextItemId(), // API always sends the same id so we need to override it to a unique id
          });
          showSuccessToast(`"${item.title}" added to cart`);
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      isAddingItemToCart.value = false;
    }
  };

  const removeItemFromCart = (id: number) => {
    const itemToRemove = cartItems.value.find((item) => item.id === id);
    if (!itemToRemove) {
      return;
    }
    cartItems.value = cartItems.value.filter(
      (item) => item.id !== itemToRemove.id,
    );
    showSuccessToast(`"${itemToRemove.title}" removed from cart`);
  };

  const saveShippingCost = (cost: number) => {
    if (!Number.isFinite(cost) || cost < 0) return;
    shippingCost.value = Number(cost.toFixed(2));
  };

  const emptyCart = () => {
    cartItems.value = [];
    shippingCost.value = 0;
  };

  const clearCart = () => {
    emptyCart();
    showSuccessToast("Cart Emptied");
  };

  const resetCartState = () => {
    emptyCart();
    isFetching.value = false;
    hasInitializedCart.value = false;
    isAddingItemToCart.value = false;
  };

  const updateItemQuantity = (id: number, quantity: number) => {
    cartItems.value = cartItems.value.map((item) =>
      item.id === id ? { ...item, quantity } : item,
    );
  };

  return {
    summary: readonly(summary),
    cartItems: readonly(cartItems),
    isFetching: readonly(isFetching),
    isAddingItemToCart: readonly(isAddingItemToCart),
    hasInitializedCart: readonly(hasInitializedCart),
    fetchCartItems,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    saveShippingCost,
    emptyCart,
    clearCart,
    resetCartState,
    getNextItemId,
  };
}
