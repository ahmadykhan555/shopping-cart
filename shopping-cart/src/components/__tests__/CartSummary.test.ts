import { cleanup, render, screen } from "@testing-library/vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CartSummary from "../cart/CartSummary.vue";
import useCart from "@/composables/useCart.ts";
import { formatMoney } from "@/utils/index.ts";
import { createDummyCartItem } from "@/utils/cart.ts";
import { STANDARD_TAX_RATE } from "@/consts/index.ts";

vi.stubGlobal(
  "fetch",
  vi.fn().mockResolvedValue({
    ok: true,
    json: () => createDummyCartItem(1),
  }),
);

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
  useCart().resetCartState();
});
describe("CartSummary", () => {
  // general sanity check

  it("renders component correctly", () => {
    const { summary } = useCart();

    render(CartSummary);

    const subTotalRow = screen.getByText(/Subtotal/i).closest("div");
    expect(subTotalRow).toHaveTextContent(
      formatMoney(summary.value.subTotal).replace(/\u00a0/g, " "),
    );

    const shippingCostRow = screen.getByText(/shipping/i).closest("div");
    expect(shippingCostRow).toHaveTextContent(
      formatMoney(summary.value.shippingCost).replace(/\u00a0/g, " "),
    );

    const taxRow = screen.getByText(/tax/i).closest("div");
    expect(taxRow).toHaveTextContent(
      formatMoney(summary.value.tax).replace(/\u00a0/g, " "),
    );

    const totalRow = screen.getByText("Total").closest("div");
    expect(totalRow).toHaveTextContent(
      formatMoney(summary.value.total).replace(/\u00a0/g, " "),
    );
  });

  it("Amounts are updated correctly when cart items are added", async () => {
    const { summary, addItemToCart } = useCart();

    render(CartSummary);

    const subTotalRow = screen.getByText(/Subtotal/i).closest("div");
    const taxRow = screen.getByText(/tax/i).closest("div");
    const totalRow = screen.getByText("Total").closest("div");

    const oldSubTotal = summary.value.subTotal;

    const addItemPayload = createDummyCartItem(1);
    await addItemToCart(addItemPayload);

    const addedItemPrice = addItemPayload.price * addItemPayload.quantity;
    const expectedSubTotal = oldSubTotal + addedItemPrice;
    const expectedTax = expectedSubTotal * STANDARD_TAX_RATE;
    const expectedTotal = expectedSubTotal + expectedTax;

    expect(subTotalRow).toHaveTextContent(
      formatMoney(expectedSubTotal).replace(/\u00a0/g, " "),
    );
    expect(taxRow).toHaveTextContent(
      formatMoney(expectedTax).replace(/\u00a0/g, " "),
    );
    expect(totalRow).toHaveTextContent(
      formatMoney(expectedTotal).replace(/\u00a0/g, " "),
    );
  });
});
