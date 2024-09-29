module.exports = [
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
      "sort-exports/sort-exports": ["error", { sortDir: "asc" }],
      "sort-imports": [
        "error",
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["all", "single", "multiple", "none"],
        },
      ],
    },
  },
];
