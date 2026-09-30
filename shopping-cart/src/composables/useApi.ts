import {
  ADD_ITEM_TO_CART_URL,
  DEFAULT_API_OPTIONS,
  FETCH_CART_ITEMS_URL,
} from "@/consts";
import useToast from "./useToast";

const DEFAULT_API_ERROR_MESSAGE = "Something went wrong. Please try again.";

const API_ERROR_MESSAGES: Record<string, string> = {
  [`GET:${FETCH_CART_ITEMS_URL}`]: "Failed to load cart items",
  [`POST:${ADD_ITEM_TO_CART_URL}`]: "Failed to add item to cart",
};

function getApiErrorMessage(url: string, init: RequestInit): string {
  const method = (init.method ?? "GET").toUpperCase();
  return API_ERROR_MESSAGES[`${method}:${url}`] ?? DEFAULT_API_ERROR_MESSAGE;
}

type ApiCallParams<T> = {
  url: string;
  options?: RequestInit;
  onSuccess?: (data: T) => void;
  onError?: (message: string) => void;
};

export default function useApi() {
  const { showErrorToast } = useToast();

  const apiCall = async <T>({
    url,
    options = DEFAULT_API_OPTIONS,
    onSuccess,
    onError,
  }: ApiCallParams<T>): Promise<boolean> => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as T;
      onSuccess?.(data);
      return true;
    } catch (err) {
      const errorMessage = getApiErrorMessage(url, options);
      console.error(errorMessage, err);
      showErrorToast(errorMessage);
      onError?.(errorMessage);
      return false;
    }
  };

  return {
    apiCall,
  };
}
