import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    minify: true,
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: "[name][extname]",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
    },
  },
});
