import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-axios",
  input: "openapi.json",
  services: {
    asClass: true,
  },
  output: {
    lint: "eslint",
    format: "prettier",
    path: "src/client",
  },
  schemas: {
    type: "json",
  },
});
