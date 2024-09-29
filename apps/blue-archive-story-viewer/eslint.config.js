export default [
  {
    env: {
      browser: true,
      es2021: true,
    },
    rules: {
      "vue/no-multiple-template-root": "off",
      "vue/multi-word-component-names": "off",
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
];
