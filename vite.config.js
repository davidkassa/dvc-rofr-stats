import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    globals: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        silenceDeprecations: ["import"],
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: /^~.+/,
        replacement: (val) => {
          return val.replace(/^~/, "node_modules/");
        },
      },
    ],
  },
  build: {
    // Disable modulepreload to avoid CORS issues with crossorigin attribute
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep ECharts and vue-echarts together to avoid initialization issues
          if (id.includes("node_modules/echarts") || id.includes("node_modules/vue-echarts")) {
            return "echarts";
          }
          // Split Oruga UI
          if (id.includes("node_modules/@oruga-ui")) {
            return "oruga";
          }
          // Split moment.js
          if (id.includes("node_modules/moment")) {
            return "moment";
          }
          // Keep Firebase with vendor to avoid circular dependency issues
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    // ECharts is inherently large (~1.5MB), but gzips well to ~515KB
    // This is acceptable for a charting library with lazy loading
    chunkSizeWarningLimit: 1600,
  },
});
