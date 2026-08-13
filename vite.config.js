import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "::",
    port: 5173,
    strictPort: false,
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
