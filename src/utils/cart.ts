import type { CartItem } from "@/types";
import {
  DUMMY_CART_ITEM_UNIT_PRICE,
  MAX_QUANTITY,
  MIN_QUANTITY,
} from "@/consts";

export function clampCartQuantity(
  value: number,
  min = MIN_QUANTITY,
  max = MAX_QUANTITY,
): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return value;
}

export const createDummyCartItem = (id: number): Omit<CartItem, "id"> => {
  return {
    title: `Title ${id}`,
    price: DUMMY_CART_ITEM_UNIT_PRICE,
    description: `Description ${id}`,
    category: `Product ${id}`,
    images: [`https://picsum.photos/seed/cart-item-${Math.random()}/72/72`],
    quantity: 1,
  };
};
