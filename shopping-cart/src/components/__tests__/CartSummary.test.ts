import { cleanup, render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CartSummary from "../cart/CartSummary.vue";
import { useCart } from "@/composables";
import { createDummyCartItem, formatMoney } from "@/utils";
import { STANDARD_TAX_RATE } from "@/consts";
import type { CartSummary as CartSummaryModel } from "@/types";

vi.stubGlobal(
  "fetch",
  vi.fn().mockResolvedValue({
    ok: true,
    json: () => createDummyCartItem(1),
  }),
);

function renderCartSummary(summary: CartSummaryModel, isFetching = false) {
  return render(CartSummary, {
    props: { summary, isFetching },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
  useCart().resetCartState();
});

describe("CartSummary", () => {
  it("renders component correctly", () => {
    const { summary } = useCart();

    renderCartSummary(summary.value);

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

  it("Amounts are updated correctly when summary prop changes", async () => {
    const { summary, addItemToCart } = useCart();

    const { rerender } = renderCartSummary(summary.value);

    const subTotalRow = screen.getByText(/Subtotal/i).closest("div");
    const taxRow = screen.getByText(/tax/i).closest("div");
    const totalRow = screen.getByText("Total").closest("div");

    const oldSubTotal = summary.value.subTotal;

    const addItemPayload = createDummyCartItem(1);
    await addItemToCart(addItemPayload);

    await rerender({ summary: summary.value, isFetching: false });

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

  it("emits click:checkout with navigation state when checkout is clicked", async () => {
    const user = userEvent.setup();
    const { summary, addItemToCart } = useCart();

    await addItemToCart(createDummyCartItem(1));

    const { emitted } = renderCartSummary(summary.value);

    const checkoutButton = screen.getByTestId("cart-checkout-button");
    expect(checkoutButton).toBeEnabled();

    await user.click(checkoutButton);

    expect(emitted()["click:checkout"]).toHaveLength(1);
    expect(emitted()["click:checkout"]!.at(0)).toEqual([
      {
        itemCount: summary.value.count,
        orderSummary: {
          itemCount: summary.value.count,
          subtotal: summary.value.subTotal,
          shipping: summary.value.shippingCost,
          tax: summary.value.tax,
          total: summary.value.total,
        },
      },
    ]);
  });

  it("disables checkout and does not emit when the cart is empty", async () => {
    const user = userEvent.setup();
    const { summary } = useCart();
    const { emitted } = renderCartSummary(summary.value);

    const checkoutButton = screen.getByTestId("cart-checkout-button");
    expect(checkoutButton).toBeDisabled();

    await user.click(checkoutButton);

    expect(emitted()["click:checkout"]).toBeUndefined();
  });

  it("disables checkout while isFetching is true", () => {
    const { summary } = useCart();

    renderCartSummary(summary.value, true);

    expect(screen.getByTestId("cart-checkout-button")).toBeDisabled();
  });
});
