import { describe, it, expect, vi, afterEach } from "vitest";
import useApi from "../useApi";
import { DEFAULT_API_OPTIONS } from "@/consts";

const mockToastError = vi.fn();

vi.mock("@/composables/useToast", () => ({
  default: () => ({
    showSuccessToast: vi.fn(),
    showErrorToast: mockToastError,
    showInfoToast: vi.fn(),
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

    const succeeded = await apiCall({
      url: "https://api.example.com",
      onSuccess: onSuccessCallback,
    });

    expect(succeeded).toBe(true);
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

  it("shows error toast and returns false when API call fails", async () => {
    const { apiCall } = useApi();
    const mockFetchRejected = vi.fn().mockRejectedValue(new Error("API error"));
    vi.stubGlobal("fetch", mockFetchRejected);
    const onSuccessCallback = vi.fn();
    const onErrorCallback = vi.fn();

    const succeeded = await apiCall({
      url: "https://api.example.com",
      onSuccess: onSuccessCallback,
      onError: onErrorCallback,
    });

    expect(succeeded).toBe(false);
    expect(mockFetchRejected).toHaveBeenCalledTimes(1);
    expect(mockToastError).toHaveBeenCalledTimes(1);
    expect(mockToastError).toHaveBeenCalledWith(
      "Something went wrong. Please try again.",
    );
    expect(onErrorCallback).toHaveBeenCalledWith(
      "Something went wrong. Please try again.",
    );
    expect(onSuccessCallback).not.toHaveBeenCalled();
  });
});
