import { fileURLToPath } from "node:url";

import { configDefaults, defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      setupFiles: ["./src/test/setup.ts"],
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        include: ["src/**/*.{ts,vue}"],
        exclude: [
          "src/**/*.test.ts",
          "src/**/__tests__/**",
          "src/test/**",
          "src/main.ts",
          "src/router.ts",
        ],
      },
    },
  }),
);
