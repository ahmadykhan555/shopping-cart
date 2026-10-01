import { MAX_CART_ITEMS } from "./cart";

export const DEFAULT_API_OPTIONS: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const BASE_API_URL = "https://dummyjson.com";
export const FETCH_CART_ITEMS_URL = `${BASE_API_URL}/products?limit=${MAX_CART_ITEMS}`;
export const ADD_ITEM_TO_CART_URL = `${BASE_API_URL}/products/add`;
