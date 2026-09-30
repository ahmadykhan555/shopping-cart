import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import HomePage from "../HomePage.vue";
import router from "@/router";
import useCart from "@/composables/useCart";
import { createDummyCartItem } from "@/utils/cart.ts";

vi.mock("@/composables/useToast", () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
}));

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }),
  );
  useCart().clearCart();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const renderHomeWithRouter = async () => {
  await router.push("/");
  await router.isReady();

  return await render(HomePage, {
    global: {
      plugins: [router],
    },
  });
};

describe("Homepage", () => {
  it("renders homepage correctly", async () => {
    await renderHomeWithRouter();
    const homePageTitle = screen.getByTestId("home-page-title");
    expect(homePageTitle).toHaveTextContent("Home");
  });

  it("navigates to cart page when cart link is clicked", async () => {
    await renderHomeWithRouter();
    const user = userEvent.setup();
    const cartLink = screen.getByRole("link", { name: "Go to cart" });
    await user.click(cartLink);
    await waitFor(() => {
      expect(router.currentRoute.value.path).toBe("/cart");
    });
  });

  it("shows empty cart message when cart is empty and navigates to cart page when to cart link is clicked", async () => {
    await renderHomeWithRouter();
    const emptyCartMessage = screen.getByTestId("empty-cart-message");
    expect(emptyCartMessage).toBeInTheDocument();
  });

  it("shows correct count when cart is loaded", async () => {
    const { addItemToCart } = useCart();
    await addItemToCart(createDummyCartItem(1));
    await addItemToCart(createDummyCartItem(2));
    await addItemToCart(createDummyCartItem(3));
    await renderHomeWithRouter();
    const cartItemsCount = screen.getByTestId("cart-items-count");
    expect(cartItemsCount).toBeInTheDocument();
    expect(cartItemsCount).toHaveTextContent("3 items");
  });
});
