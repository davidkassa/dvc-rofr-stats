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
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split Firebase into its own chunk
          if (id.includes("node_modules/firebase")) {
            return "firebase";
          }
          // Split ECharts core and components
          if (id.includes("node_modules/echarts")) {
            return "echarts";
          }
          if (id.includes("node_modules/vue-echarts")) {
            return "vue-echarts";
          }
          // Split Oruga UI
          if (id.includes("node_modules/@oruga-ui")) {
            return "oruga";
          }
          // Split moment.js
          if (id.includes("node_modules/moment")) {
            return "moment";
          }
          // Split other vendor code
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
