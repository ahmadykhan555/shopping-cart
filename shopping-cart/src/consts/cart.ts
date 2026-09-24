import type { CartItem } from "@/types";

export const BASE_API_URL = "https://fakestoreapi.com";
export const FETCH_CART_ITEMS_URL = `${BASE_API_URL}/products`;
export const ADD_ITEM_TO_CART_URL = `${BASE_API_URL}/products`;
export const FETCH_ITEM_BY_ID_URL = (id: number) =>
  `${BASE_API_URL}/products/${id}`;
export const STANDARD_TAX_RATE = 0.2; // 20%
export const MAX_CART_ITEMS = 15;

export const DUMMY_CART_ITEM_PAYLOAD: CartItem = {
  id: 1,
  title: "lorem ipsum dolor sit amet",
  price: 100,
  description: "lorem ipsum dolor sit amet",
  category: "Category",
  image: "https://via.placeholder.com/150",
  quantity: 1,
};
