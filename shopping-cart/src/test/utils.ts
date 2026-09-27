import { render } from "@testing-library/vue";
import router from "@/router";
import type { Component } from "vue";

export const renderWithRouter = async (component: Component) => {
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
