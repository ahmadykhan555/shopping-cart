import { DEFAULT_API_OPTIONS } from "@/consts";
import { ADD_ITEM_TO_CART_URL, FETCH_CART_ITEMS_URL } from "@/consts/cart";
import { useToast } from "./useToast";

const DEFAULT_API_ERROR_MESSAGE = "Something went wrong. Please try again.";

const API_ERROR_MESSAGES: Record<string, string> = {
  [`GET:${FETCH_CART_ITEMS_URL}`]: "Failed to load cart items",
  [`POST:${ADD_ITEM_TO_CART_URL}`]: "Failed to add item to cart",
};

function getApiErrorMessage(url: string, init: RequestInit): string {
  const method = (init.method ?? "GET").toUpperCase();
  return API_ERROR_MESSAGES[`${method}:${url}`] ?? DEFAULT_API_ERROR_MESSAGE;
}

export default function useApi() {
  const { error } = useToast();
  const apiCall = async <T>(
    url: string,
    options: RequestInit = DEFAULT_API_OPTIONS,
    onSuccess?: (data: T) => void,
  ): Promise<void> => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as T;
      onSuccess?.(data);
    } catch (err) {
      console.error(err);
      error(getApiErrorMessage(url, options));
    }
  };

  return {
    apiCall,
  };
}
