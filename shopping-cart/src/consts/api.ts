export const DEFAULT_API_OPTIONS: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export const BASE_API_URL = "https://dummyjson.com";
export const FETCH_CART_ITEMS_URL = `${BASE_API_URL}/products`;
export const ADD_ITEM_TO_CART_URL = `${BASE_API_URL}/products/add`;
export const FETCH_ITEM_BY_ID_URL = (id: number) =>
  `${BASE_API_URL}/products/${id}`;
