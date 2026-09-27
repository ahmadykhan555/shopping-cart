import { describe, it, expect, afterAll, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import HomePage from "./HomePage.vue";
import router from "@/router";
import useCart from "@/composables/useCart.js";
import { createDummyCartItem } from "@/utils/cart.js";

const renderHomeWithRouter = async () => {
  return await render(HomePage, {
    global: {
      plugins: [router],
    },
  });
};

afterEach(() => cleanup());

describe("Homepage", () => {
  it("renders homepage correctly", async () => {
    await render(HomePage);
    const homePageTitle = screen.getByTestId("home-page-title");
    expect(homePageTitle).toHaveTextContent("Home");
  });

  it("navigates to cart page when cart link is clicked", async () => {
    await renderHomeWithRouter();
    const user = userEvent.setup();
    const cartLink = screen.getByRole("link", { name: "Go to cart" });
    await user.click(cartLink);
    expect(router.currentRoute.value.path).toBe("/cart");
  });

  it("shows empty cart message when cart is empty and navigates to cart page when to cart link is clicked", async () => {
    await renderHomeWithRouter();
    const emptyCartMessage = screen.getByTestId("empty-cart-message");
    expect(emptyCartMessage).toBeInTheDocument();
  });
  it("shows correct count when cart is loaded", async () => {
    const { cartItems } = useCart();
    cartItems.value = [
      createDummyCartItem(1),
      createDummyCartItem(2),
      createDummyCartItem(3),
    ];
    await renderHomeWithRouter();
    const cartItemsCount = screen.getByTestId("cart-items-count");
    expect(cartItemsCount).toBeInTheDocument();
    expect(cartItemsCount).toHaveTextContent("3 items");
  });
});
