import { cleanup, render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import CartActions from "../cart/CartActions.vue";

afterEach(() => cleanup());

describe("CartActions", () => {
  it("enables both buttons by default", () => {
    render(CartActions);

    expect(screen.getByTestId("cart-add-item-button")).toBeEnabled();
    expect(screen.getByTestId("cart-clear-button")).toBeEnabled();
  });

  it("disables both buttons when disableAddButton and disableClearButton are true", () => {
    render(CartActions, {
      props: {
        disableAddButton: true,
        disableClearButton: true,
      },
    });

    expect(screen.getByTestId("cart-add-item-button")).toBeDisabled();
    expect(screen.getByTestId("cart-clear-button")).toBeDisabled();
  });

  it("emits addItem and clearCart when buttons are enabled", async () => {
    const user = userEvent.setup();
    const { emitted } = render(CartActions);

    await user.click(screen.getByTestId("cart-add-item-button"));
    await user.click(screen.getByTestId("cart-clear-button"));

    expect(emitted().addItem).toHaveLength(1);
    expect(emitted().clearCart).toHaveLength(1);
  });
});
