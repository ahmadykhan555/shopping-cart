import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { cleanup, screen, waitFor } from "@testing-library/vue";
import AppHeader from "../base/AppHeader.vue";
import { renderWithRouter } from "@/test/utils.ts";
import userEvent from "@testing-library/user-event";
import { useCart } from "@/composables";
import { DEFAULT_ROUTE } from "@/consts";
import { createDummyCartItem } from "@/utils/";

vi.mock("@/composables/useToast", () => ({
  default: () => ({
    showSuccessToast: vi.fn(),
    showErrorToast: vi.fn(),
    showInfoToast: vi.fn(),
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
  useCart().resetCartState();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("AppHeader", () => {
  it("renders logo and cart links", async () => {
    await renderWithRouter(AppHeader);
    expect(screen.getByRole("link", { name: "Neuffer" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cart" })).toBeInTheDocument();
  });

  it("navigates to cart when logo or cart link is clicked", async () => {
    const { router } = await renderWithRouter(AppHeader, "/checkout/success");
    const user = userEvent.setup();

    await user.click(screen.getByTestId("site-logo"));
    await waitFor(() => {
      expect(router.currentRoute.value.path).toBe(DEFAULT_ROUTE);
    });

    await router.push("/checkout/success");
    await router.isReady();

    const cartLink = screen.getByRole("link", { name: "Cart" });
    await user.click(cartLink);
    await waitFor(() => {
      expect(router.currentRoute.value.path).toBe(DEFAULT_ROUTE);
    });
  });

  it("displays the cart count when there are items in the cart", async () => {
    const { addItemToCart, getNextItemId } = useCart();
    await addItemToCart(createDummyCartItem(getNextItemId()));
    await addItemToCart(createDummyCartItem(getNextItemId()));
    await addItemToCart(createDummyCartItem(getNextItemId()));

    await renderWithRouter(AppHeader);
    const cartLink = screen.getByRole("link", { name: /cart/i });
    expect(cartLink).toBeInTheDocument();
    expect(cartLink).toHaveTextContent("3");
  });
});
