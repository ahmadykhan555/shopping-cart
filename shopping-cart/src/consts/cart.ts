export const BASE_API_URL = "https://fakestoreapi.com";
export const FETCH_CART_ITEMS_URL = `${BASE_API_URL}/products`;
export const ADD_ITEM_TO_CART_URL = `${BASE_API_URL}/products`;
export const FETCH_ITEM_BY_ID_URL = (id: number) =>
  `${BASE_API_URL}/products/${id}`;
export const STANDARD_TAX_RATE = 0.2; // 20%
export const MAX_CART_ITEMS = 15;
