import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import useTotalWithShippingCost from "../useTotalWithShippingCost";
import useCart from "../useCart";
import useCalculateShippingCost from "../useCalculateShippingCost";
import { DUMMY_CART_ITEM_UNIT_PRICE, STANDARD_TAX_RATE } from "@/consts";
import { createDummyCartItem } from "@/utils/cart";

beforeEach(() => {
  useCart().clearCart();
  let addCount = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation(() => {
      addCount += 1;
      return Promise.resolve({
        ok: true,
        json: async () => createDummyCartItem(addCount),
      });
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("useTotalWithShippingCost", () => {
  it("returns the total with shipping cost", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0); // with min set to 5 , we get 5 if random number is 0
    const expectedShipping = 5;

    const { addItemToCart } = useCart();
    // POST mock returns dummy items at price 10 → 3 items = 30 + tax
    await addItemToCart();
    await addItemToCart();
    await addItemToCart();

    const expectedSubtotal = 3 * DUMMY_CART_ITEM_UNIT_PRICE;
    const expectedTotalWithTax = Number(
      (expectedSubtotal * (1 + STANDARD_TAX_RATE)).toFixed(2),
    );

    useCalculateShippingCost().calculateShippingCost();

    const { totalWithShippingCost, shippingCost, totalWithoutShippingCost } =
      useTotalWithShippingCost();

    expect(shippingCost.value).toBe(expectedShipping);
    expect(totalWithoutShippingCost.value).toBe(expectedTotalWithTax);
    expect(totalWithShippingCost.value).toBe(
      expectedTotalWithTax + expectedShipping,
    );
  });
});
