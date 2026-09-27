import { describe, it, expect, afterEach } from "vitest";
import { cleanup, screen } from "@testing-library/vue";
import AppHeader from "../AppHeader.vue";
import { renderWithRouter } from "@/test/utils.ts";
import userEvent from "@testing-library/user-event";
import useCart from "@/composables/useCart.ts";
import { createDummyCartItem } from "@/utils/cart.ts";

afterEach(() => cleanup());
describe("AppHeader", () => {
  it("renders links to home and cart pages", async () => {
    await renderWithRouter(AppHeader);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toBeInTheDocument();
    const cartLink = screen.getByRole("link", { name: "Cart" });
    expect(cartLink).toBeInTheDocument();
  });
  it("navigates to correct page when home and cart links are clicked", async () => {
    const { router } = await renderWithRouter(AppHeader);
    const user = userEvent.setup();

    // navigate to cart page
    const cartLink = screen.getByRole("link", { name: "Cart" });
    await user.click(cartLink);
    expect(router.currentRoute.value.path).toBe("/cart");

    // navigate to home page
    const homeLink = screen.getByRole("link", { name: "Home" });
    await user.click(homeLink);
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("displays the cart count when there are items in the cart", async () => {
    const { cartItems } = useCart();
    cartItems.value = [
      createDummyCartItem(1),
      createDummyCartItem(2),
      createDummyCartItem(3),
    ];
    await renderWithRouter(AppHeader);
    const cartLink = screen.getByRole("link", { name: /cart/i });
    expect(cartLink).toBeInTheDocument();
    expect(cartLink).toHaveTextContent("3");
  });
});
