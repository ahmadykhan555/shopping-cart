import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { cleanup, screen, waitFor } from "@testing-library/vue";
import AppHeader from "../AppHeader.vue";
import { renderWithRouter } from "@/test/utils.ts";
import userEvent from "@testing-library/user-event";
import useCart from "@/composables/useCart.ts";

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

    const cartLink = screen.getByRole("link", { name: "Cart" });
    await user.click(cartLink);
    await waitFor(() => {
      expect(router.currentRoute.value.path).toBe("/cart");
    });

    const homeLink = screen.getByRole("link", { name: "Home" });
    await user.click(homeLink);
    await waitFor(() => {
      expect(router.currentRoute.value.path).toBe("/");
    });
  });

  it("displays the cart count when there are items in the cart", async () => {
    const { addItemToCart } = useCart();
    await addItemToCart(1);
    await addItemToCart(2);
    await addItemToCart(3);
    await renderWithRouter(AppHeader);
    const cartLink = screen.getByRole("link", { name: /cart/i });
    expect(cartLink).toBeInTheDocument();
    expect(cartLink).toHaveTextContent("3");
  });
});
