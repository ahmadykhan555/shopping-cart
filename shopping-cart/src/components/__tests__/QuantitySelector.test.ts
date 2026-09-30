import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { describe, it, expect, beforeEach } from "vitest";
import QuantitySelector from "../cart/QuantitySelector.vue";
import userEvent from "@testing-library/user-event";
import { MAX_QUANTITY, MIN_QUANTITY } from "@/consts";

beforeEach(() => cleanup());

const renderQuantitySelector = (quantity: number) => {
  return render(QuantitySelector, {
    props: {
      quantity,
    },
  });
};

describe("QuantitySelector", () => {
  it("renders component correctly", () => {
    render(QuantitySelector, {
      props: {
        quantity: 5,
      },
    });

    const decrementButton = screen.getByTestId("decrement-quantity-button");
    const incrementButton = screen.getByTestId("increment-quantity-button");
    const quantityInput = screen.getByRole("spinbutton");

    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    expect(quantityInput).toBeInTheDocument();
    expect(quantityInput).toHaveValue(5);
  });

  it("Correctly increments/decrements the quantity when + or - button is clicked", async () => {
    await renderQuantitySelector(5);

    const incrementButton = screen.getByTestId("increment-quantity-button");
    const quantityInput = screen.getByRole("spinbutton");
    // test increment
    expect(incrementButton).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(incrementButton);
    expect(quantityInput).toHaveValue(6);

    // test decrement
    const decrementButton = screen.getByTestId("decrement-quantity-button");
    await user.click(decrementButton);
    expect(quantityInput).toHaveValue(5);
  });

  it("Does not allow setting quantity below min quantity; default to min quantity", () => {
    renderQuantitySelector(0);

    const inputField = screen.getByRole("spinbutton");
    expect(inputField).toHaveValue(MIN_QUANTITY);
  });

  it("Disallows negative values during decrement", async () => {
    renderQuantitySelector(1);

    const inputField = screen.getByRole("spinbutton");
    const decrementButton = screen.getByTestId("decrement-quantity-button");
    const user = userEvent.setup();
    await user.click(decrementButton);
    expect(inputField).toHaveValue(MIN_QUANTITY);
  });
  it("Disallows values above max quantity during increment", async () => {
    renderQuantitySelector(MAX_QUANTITY - 1);

    const inputField = screen.getByRole("spinbutton");
    ``;
    const incrementButton = screen.getByTestId("increment-quantity-button");
    const user = userEvent.setup();

    await user.click(incrementButton); // quantity is 10
    await user.click(incrementButton); // should not change quantity

    expect(inputField).toHaveValue(MAX_QUANTITY);
  });

  it("Emits update:quantity on input change and sanitizes it", async () => {
    const { emitted } = renderQuantitySelector(1);
    const inputField = screen.getByRole("spinbutton");
    expect(inputField).toBeInTheDocument();

    const user = userEvent.setup();
    await user.type(inputField, "10");

    expect(inputField).toHaveValue(10);
    expect(emitted()["update:quantity"]!.at(-1)).toEqual([10]);
  });

  it("sanitizes input in user types a value greater than max quantity", async () => {
    renderQuantitySelector(1);
    const inputField = screen.getByRole("spinbutton");
    const user = userEvent.setup();
    await user.type(inputField, "11");
    expect(inputField).toHaveValue(MAX_QUANTITY);
  });
  it("sanitizes input in user types a value les than min quantity", async () => {
    renderQuantitySelector(1);
    const inputField = screen.getByRole("spinbutton");
    await fireEvent.update(inputField, "-10");
    expect(inputField).toHaveValue(MIN_QUANTITY);
  });
});
