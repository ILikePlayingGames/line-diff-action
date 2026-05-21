// eslint.config.mjs
// @ts-check

import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.recommended,
  stylistic.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
    },
    files: ['./src/**/*.ts'],
  },
)
