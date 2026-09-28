import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import useTotalWithShippingCost from "../useTotalWithShippingCost";
import useCart from "../useCart";
import useCalculateShippingCost from "../useCalculateShippingCost";
import { STANDARD_TAX_RATE } from "@/consts";

beforeEach(() => {
  useCart().clearCart();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
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
    await addItemToCart(1); // indirectly calls createDummyCartItem where price is 100; so 3 items in cart = 300 + 20% tax
    await addItemToCart(2);
    await addItemToCart(3);

    const expectedSubtotal = 3 * 100;
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
