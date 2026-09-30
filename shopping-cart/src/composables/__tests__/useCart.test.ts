import { describe, it, expect, vi, afterEach } from "vitest";
import type { Ref } from "vue";
import useCart from "../useCart";
import { createDummyCartItem } from "@/utils/cart";
import {
  DUMMY_CART_ITEM_UNIT_PRICE,
  MAX_CART_ITEMS,
  MAX_QUANTITY,
  MIN_QUANTITY,
  STANDARD_TAX_RATE,
} from "@/consts";
import type { CartItem, CartSummary } from "@/types";

type UseCartReturn = ReturnType<typeof useCart>;

// DummyJSON's POST /products/add always echoes back this same id,
// which is why the store assigns its own id instead.
const API_ADD_ITEM_RESPONSE_ID = 195;

const createDummyProduct = (id: number): CartItem => ({
  ...createDummyCartItem(id),
  id,
});

function mockFetchWithDummyItems(count: number) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((_url, init?: RequestInit) =>
      Promise.resolve({
        ok: true,
        json: async () =>
          init?.method?.toUpperCase() === "POST"
            ? createDummyProduct(API_ADD_ITEM_RESPONSE_ID)
            : {
                products: Array.from({ length: count }, (_, i) =>
                  createDummyProduct(i + 1),
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
  expect(summary.value.subTotal).toEqual(expectedTotalWithoutTax);
  expect(summary.value.total).toEqual(
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
  default: () => ({
    showSuccessToast: vi.fn(),
    showErrorToast: vi.fn(),
    showInfoToast: vi.fn(),
  }),
}));

afterEach(() => {
  useCart().resetCartState();
});

describe("useCart composable", () => {
  it("initial cart state - empty cart", () => {
    const { cartItems, summary, isFetching } = useCart();
    expect(cartItems.value.length).toEqual(0);
    expect(summary.value.subTotal).toEqual(0);
    expect(summary.value.tax).toEqual(0);
    expect(summary.value.count).toEqual(0);
    expect(summary.value.total).toEqual(0);
    expect(isFetching.value).toEqual(false);
  });

  it("cart state is correct after fetching cart items", async () => {
    const { cartItems, summary } = await seedCart(MAX_CART_ITEMS);
    assertCartSize(cartItems, summary, MAX_CART_ITEMS);
    const totalWithoutTax = cartItems.value.reduce((acc, item) => {
      acc += item.price * item.quantity;
      return acc;
    }, 0);
    const tax = totalWithoutTax * STANDARD_TAX_RATE;
    expect(summary.value.subTotal).toEqual(totalWithoutTax);
    expect(summary.value.total).toEqual(tax + totalWithoutTax);
  });

  it("add item to cart, assert totals are correctly updated", async () => {
    const { summary, addItemToCart, cartItems } = await seedCart(5);

    assertCartSize(cartItems, summary, 5);
    assertSummaryFromSubtotal(summary, 5 * DUMMY_CART_ITEM_UNIT_PRICE);

    await addItemToCart(createDummyCartItem(1));
    assertCartSize(cartItems, summary, 6);
    assertSummaryFromSubtotal(summary, 6 * DUMMY_CART_ITEM_UNIT_PRICE);
  });

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

  it("clamps quantity when updating item quantity", async () => {
    const { updateItemQuantity, cartItems } = await seedCart(5);

    updateItemQuantity(1, MAX_QUANTITY + 100);
    expect(cartItems.value.find((item) => item.id === 1)?.quantity).toBe(
      MAX_QUANTITY,
    );

    updateItemQuantity(1, MIN_QUANTITY - 5);
    expect(cartItems.value.find((item) => item.id === 1)?.quantity).toBe(
      MIN_QUANTITY,
    );

    updateItemQuantity(999, 5);
    expect(cartItems.value.find((item) => item.id === 999)).toBeUndefined();
  });

  it("remove item from cart, assert totals are correctly updated", async () => {
    const { summary, removeItemFromCart, cartItems } = await seedCart(5);

    expect(cartItems.value.length).toEqual(5);
    const totalBeforeRemove = summary.value.subTotal;
    await removeItemFromCart(1);
    expect(cartItems.value.length).toEqual(4);
    expect(summary.value.subTotal).toEqual(
      totalBeforeRemove - DUMMY_CART_ITEM_UNIT_PRICE,
    );
  });

  it("assigns a unique id to added items after a removal", async () => {
    const { cartItems, addItemToCart, removeItemFromCart } = await seedCart(5);

    await removeItemFromCart(3);
    await addItemToCart(createDummyCartItem(6));

    const ids = cartItems.value.map((item) => item.id);
    expect(new Set(ids).size).toEqual(ids.length);
    expect(ids.at(-1)).toEqual(6);
  });

  it("clear cart, assert totals are correctly updated", async () => {
    const { summary, clearCart, cartItems } = await seedCart(5);

    expect(cartItems.value.length).toEqual(5);
    const totalBeforeClear = summary.value.subTotal;
    assertSummaryFromSubtotal(summary, totalBeforeClear);
    await clearCart();
    expect(cartItems.value.length).toEqual(0);
    expect(summary.value.subTotal).toEqual(0);
  });
});
