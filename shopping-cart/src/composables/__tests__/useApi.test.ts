import { describe, it, expect, vi, afterEach } from "vitest";
import useApi from "../useApi";
import { DEFAULT_API_OPTIONS } from "@/consts";

vi.mock("@/composables/useToast", () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
}));

const mockFetchSuccess = <T>(body: T) =>
  vi.fn().mockResolvedValue({
    ok: true,
    json: async () => body,
  });

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("useApi composable", () => {
  it("calls onSuccess callback when API call is successful", async () => {
    const { apiCall } = useApi();
    const mockFetch = mockFetchSuccess({
      id: 1,
      title: "Test item",
    });
    vi.stubGlobal("fetch", mockFetch);
    const onSuccessCallback = vi.fn();

    await apiCall({
      url: "https://api.example.com",
      onSuccess: onSuccessCallback,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com",
      DEFAULT_API_OPTIONS,
    );
    expect(onSuccessCallback).toHaveBeenCalledWith({
      id: 1,
      title: "Test item",
    });
    expect(onSuccessCallback).toHaveBeenCalledTimes(1);
  });
});
