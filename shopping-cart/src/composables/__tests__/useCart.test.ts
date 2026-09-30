import { describe, it, expect, vi, afterEach } from "vitest";
import type { Ref } from "vue";
import useCart from "../useCart";
import { createDummyCartItem } from "@/utils/cart";
import {
  DUMMY_CART_ITEM_UNIT_PRICE,
  MAX_CART_ITEMS,
  STANDARD_TAX_RATE,
} from "@/consts";
import type { CartSummary } from "@/types";

type UseCartReturn = ReturnType<typeof useCart>;

function mockFetchWithDummyItems(count: number) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((_url, init?: RequestInit) =>
      Promise.resolve({
        ok: true,
        json: async () =>
          init?.method?.toUpperCase() === "POST"
            ? createDummyCartItem(count + 1)
            : {
                products: Array.from({ length: count }, (_, i) =>
                  createDummyCartItem(i + 1),
                ),
              },
      }),
    ),
  );
}

function assertSummaryFromSubtotal(
  summary: Readonly<Ref<CartSummary>>,
  expectedTotalWithoutTax: number,
) {
  expect(summary.value.total).toEqual(expectedTotalWithoutTax);
  expect(summary.value.totalWithTax).toEqual(
    expectedTotalWithoutTax * STANDARD_TAX_RATE + expectedTotalWithoutTax,
  );
}

function assertCartSize(
  cartItems: UseCartReturn["cartItems"],
  summary: UseCartReturn["summary"],
  count: number,
) {
  expect(cartItems.value.length).toEqual(count);
  expect(summary.value.count).toEqual(count);
}

async function seedCart(count: number) {
  mockFetchWithDummyItems(count);
  const cart = useCart();
  await cart.fetchCartItems();
  return cart;
}

vi.mock("@/composables/useToast", () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
}));

afterEach(() => {
  useCart().clearCart();
});

describe("useCart composable", () => {
  // 1. initial state: 0 items in cart, summary is 0, items are empty, isFetching is false
  it("initial cart state - empty cart", () => {
    const { cartItems, summary, isFetching } = useCart();
    expect(cartItems.value.length).toEqual(0);
    expect(summary.value.total).toEqual(0);
    expect(summary.value.tax).toEqual(0);
    expect(summary.value.count).toEqual(0);
    expect(summary.value.totalWithTax).toEqual(0);
    expect(isFetching.value).toEqual(false);
  });

  // 2. cart items are fetched, limit respected, quantity is set to 1 as a fallback, sub total and total are calculated - no shipping cost
  it("cart state is correct after fetching cart items", async () => {
    const { cartItems, summary } = await seedCart(MAX_CART_ITEMS);
    assertCartSize(cartItems, summary, MAX_CART_ITEMS);
    const totalWithoutTax = cartItems.value.reduce((acc, item) => {
      acc += item.price * item.quantity;
      return acc;
    }, 0);
    const tax = totalWithoutTax * STANDARD_TAX_RATE;
    expect(summary.value.total).toEqual(totalWithoutTax);
    expect(summary.value.totalWithTax).toEqual(tax + totalWithoutTax);
  });

  // 3. add item to cart, assert totals are correctly updated
  it("add item to cart, assert totals are correctly updated", async () => {
    const { summary, addItemToCart, cartItems } = await seedCart(5);

    assertCartSize(cartItems, summary, 5);
    assertSummaryFromSubtotal(summary, 5 * DUMMY_CART_ITEM_UNIT_PRICE);

    await addItemToCart(createDummyCartItem(1));
    assertCartSize(cartItems, summary, 6);
    assertSummaryFromSubtotal(summary, 6 * DUMMY_CART_ITEM_UNIT_PRICE);
  });

  // 4. update item quantity, assert totals are correctly updated
  it("update item quantity, assert totals are correctly updated", async () => {
    const { summary, updateItemQuantity, cartItems } = await seedCart(5);

    assertCartSize(cartItems, summary, 5);
    const expectedTotalWithoutTax = 5 * DUMMY_CART_ITEM_UNIT_PRICE;
    assertSummaryFromSubtotal(summary, expectedTotalWithoutTax);

    const newQuantity = 2;
    await updateItemQuantity(1, newQuantity);
    expect(cartItems.value.length).toEqual(5);
    assertSummaryFromSubtotal(
      summary,
      expectedTotalWithoutTax + DUMMY_CART_ITEM_UNIT_PRICE * (newQuantity - 1),
    );
  });

  // 5. remove item from cart, assert totals are correctly updated
  it("remove item from cart, assert totals are correctly updated", async () => {
    const { summary, removeItemFromCart, cartItems } = await seedCart(5);

    expect(cartItems.value.length).toEqual(5);
    const totalBeforeRemove = summary.value.total;
    await removeItemFromCart(1);
    expect(cartItems.value.length).toEqual(4);
    expect(summary.value.total).toEqual(
      totalBeforeRemove - DUMMY_CART_ITEM_UNIT_PRICE,
    );
  });

  // 6. clear cart, assert totals are correctly updated
  it("clear cart, assert totals are correctly updated", async () => {
    const { summary, clearCart, cartItems } = await seedCart(5);

    expect(cartItems.value.length).toEqual(5);
    const totalBeforeClear = summary.value.total;
    assertSummaryFromSubtotal(summary, totalBeforeClear);
    await clearCart();
    expect(cartItems.value.length).toEqual(0);
    expect(summary.value.total).toEqual(0);
  });
});
