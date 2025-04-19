import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import vueParser from "vue-eslint-parser";
import vuePlugin from "eslint-plugin-vue";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      indent: ["error", 2, { SwitchCase: 1 }],
      "max-len": ["error", { code: 120 }],
      "linebreak-style": ["error", "unix"],
      semi: ["warn", "always"],
      "comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          exports: "always-multiline",
          functions: "ignore",
        },
      ],
    },
  },
  {
    files: ["**/*.vue"],
    plugins: {
      vue: vuePlugin,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
    rules: {
      ...vuePlugin.configs.base.rules,
      ...vuePlugin.configs["vue3-recommended"].rules,
      "vue/no-multiple-template-root": "off",
      "vue/multi-word-component-names": "off",
      "vue/component-tags-order": [
        "error",
        {
          order: ["script", "template", "style"],
        },
      ],
      "vue/block-lang": [
        "error",
        {
          script: { lang: "ts" },
          style: { lang: "scss" },
        },
      ],
    },
  },
  {
    ignores: [
      "node_modules",
      ".DS_Store",
      "dist",
      "dist-ssr",
      "*.local",
      "presets",
      "*.d.ts",
      "gstc.wasm.esm.min.js",
    ],
  },
];
