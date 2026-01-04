import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: `https://recipes.lawsonserver.xyz/openapi.json`,
    output: {
      mode: "tags-split",
      target: "lib/api/generated",
      schemas: "lib/api/generated/model",
      override: {
        mutator: {
          path: "./lib/http/api-mutator.ts",
          name: "serverApi",
        },
      },
    },
  },
});
