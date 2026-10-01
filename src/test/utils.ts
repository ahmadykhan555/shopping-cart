import { render } from "@testing-library/vue";
import router from "@/router";
import { DEFAULT_ROUTE } from "@/consts";
import type { Component } from "vue";

export const renderWithRouter = async (
  component: Component,
  initialPath = DEFAULT_ROUTE,
) => {
  await router.push(initialPath);
  await router.isReady();

  const renderedComponent = await render(component, {
    global: {
      plugins: [router],
    },
  });

  return {
    renderedComponent,
    router,
  };
};
