import type { CartItem } from "@/types";

export const createDummyCartItem = (id: number): CartItem => {
  return {
    title: `lorem ipsum dolor sit amet ${id}`,
    price: 100,
    description: `lorem ipsum dolor sit amet ${id}`,
    category: `Category ${id}`,
    images: [`https://picsum.photos/seed/cart-item-${Math.random()}/150/150`],
    quantity: 1,
    id,
  };
};
