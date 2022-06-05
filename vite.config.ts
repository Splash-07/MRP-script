import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { resolve } from "path";
export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    minify: true,
    assetsDir: "assets",
    rollupOptions: {
      // input: {
      //   test: resolve("./src/test.ts"),
      // },
      output: {
        assetFileNames: "[name][extname]",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
    },
  },
});
