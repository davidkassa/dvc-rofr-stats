import { defineConfig } from "vite";
//import vue from "@vitejs/plugin-vue";
import vue from "@vitejs/plugin-vue2";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    globals: true,
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
});
