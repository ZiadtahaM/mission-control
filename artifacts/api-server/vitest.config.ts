import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 30000,
    globals: false,
    include: ["src/__tests__/**/*.test.ts"],
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
  resolve: {
    alias: {
      "@workspace/db": resolve(__dirname, "../../lib/db/src/index.ts"),
      "@workspace/api-zod": resolve(
        __dirname,
        "../../lib/api-zod/src/index.ts",
      ),
    },
  },
});
