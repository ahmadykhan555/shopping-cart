import type { CartItem } from "@/types";
import { DUMMY_CART_ITEM_UNIT_PRICE } from "@/consts";

export const createDummyCartItem = (id: number): CartItem => {
  return {
    title: `Title ${id}`,
    price: DUMMY_CART_ITEM_UNIT_PRICE,
    description: `Description ${id}`,
    category: `Category ${id}`,
    images: [`https://picsum.photos/seed/cart-item-${Math.random()}/150/150`],
    quantity: 1,
    id: id,
  };
};
