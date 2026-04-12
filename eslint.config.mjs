import pluginVue from "eslint-plugin-vue";
import vuePrettier from "@vue/eslint-config-prettier";

export default [
  ...pluginVue.configs["flat/essential"],
  vuePrettier,
  {
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "vue/multi-word-component-names": [
        "error",
        {
          ignores: ["Home", "About"],
        },
      ],
      "vue/no-mutating-props": "warn",
    },
  },
  {
    files: [
      "**/__tests__/*.{j,t}s?(x)",
      "**/tests/unit/**/*.spec.{j,t}s?(x)",
    ],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        vi: "readonly",
      },
    },
    rules: {
      "no-console": "off",
    },
  },
  {
    ignores: [
      "node_modules/",
      "dist/",
      "functions/",
      "coverage/",
    ],
  },
];
