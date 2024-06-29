// eslint.config.mjs
// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended, {
    rules: {
      "no-unused-vars": "warn"
    },
    ignores: [
      "dist/*",
      "lib/*"
    ]
  }
);