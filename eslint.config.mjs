// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  ...storybook.configs["flat/recommended"],
  {
    // The Storybook plugin's recommended config globs `*.story.*` as well as
    // `*.stories.*`, but `<name>.story.tsx` is a Fumadocs Story — a plain
    // module exporting `story`, with no default export and no CSF naming.
    // Storybook itself never loads these (.storybook/main.ts globs
    // `*.stories.@(js|jsx|mjs|ts|tsx)`), so its rules do not apply.
    files: ["**/*.story.tsx", "**/*.demo.tsx"],
    rules: {
      "storybook/default-exports": "off",
      "storybook/prefer-pascal-case": "off",
    },
  },
]);

export default eslintConfig;
