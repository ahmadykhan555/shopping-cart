import { cleanup, render, screen } from "@testing-library/vue";
import { describe, it, expect, afterEach } from "vitest";
import AppButton, { type ButtonProps } from "../AppButton.vue";
import type { Component } from "vue";

function renderButton(content: string | Component, props: ButtonProps) {
  return render(AppButton, {
    slots: {
      default: content,
    },
    props,
  });
}

afterEach(() => cleanup());
describe("AppButton", () => {
  it("renders button with correct text content", async () => {
    await renderButton("Click me", {
      variant: "primary",
    });
    const renderedButton = screen.getByText("Click me");
    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton).toHaveClass("bg-blue-500"); // default variant
  });

  it("renders button with correct variant", async () => {
    await renderButton("Button 1", {
      variant: "primary",
    });
    expect(screen.getByText("Button 1")).toHaveClass("bg-blue-500");

    await renderButton("Button 2", {
      variant: "danger",
    });
    expect(screen.getByText("Button 2")).toHaveClass("bg-red-500");

    await renderButton("Button 3", {
      variant: "ghost",
    });
    expect(screen.getByText("Button 3")).toHaveClass("bg-transparent");
  });

  it("renders button with correct disabled state", async () => {
    await renderButton("Test Button", {
      disabled: true,
    });
    const renderedButton = screen.getByText("Test Button");
    expect(renderedButton).toHaveAttribute("disabled");
    expect(renderedButton).toHaveClass("cursor-not-allowed opacity-50");
  });

  it("correctly render passed html as slot content", async () => {
    await renderButton("<span>Test Button</span>", {
      variant: "primary",
    });

    const renderedButton = screen.getByText("Test Button");
    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton.tagName).toBe("SPAN");
  });
});
