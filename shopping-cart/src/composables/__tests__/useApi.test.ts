import { describe, it, expect, vi, afterEach } from "vitest";
import useApi from "../useApi";
import { DEFAULT_API_OPTIONS } from "@/consts";

const mockToastError = vi.fn();

vi.mock("@/composables/useToast", () => ({
  useToast: () => ({
    success: vi.fn(),
    error: mockToastError,
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
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it("show error message when API call fails", async () => {
    const { apiCall } = useApi();
    const mockFetchRejected = vi.fn().mockRejectedValue(new Error("API error"));
    vi.stubGlobal("fetch", mockFetchRejected);
    const onSuccessCallback = vi.fn();
    await expect(
      apiCall({
        url: "https://api.example.com",
        onSuccess: onSuccessCallback,
      }),
    ).rejects.toThrow("Something went wrong. Please try again.");
    expect(mockFetchRejected).toHaveBeenCalledTimes(1);
    expect(mockToastError).toHaveBeenCalledTimes(1);
    expect(mockToastError).toHaveBeenCalledWith(
      "Something went wrong. Please try again.",
    );
    expect(onSuccessCallback).not.toHaveBeenCalled();
  });
});
