import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import typeormTypescriptRecommended from "eslint-plugin-typeorm-typescript/recommended";

export default [
  // Global Ignores
  {
    ignores: ["dist/**", "node_modules/**", "*.d.ts"],
  },

  // TypeORM TypeScript recommended rules (Spread into the array properly)
  ...(Array.isArray(typeormTypescriptRecommended)
    ? typeormTypescriptRecommended
    : [typeormTypescriptRecommended]),

  /* JS (build, config, scripts) */
  {
    files: ["**/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        process: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
  },

  /* TS ONLY INSIDE SRC */
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["src/**/*.ts"],
  })),

  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true, // Recommended if type-checking plugins need it
      },
    },
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
    },

    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],

      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal"],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],

      ...prettier.rules,
    },
  },
];
