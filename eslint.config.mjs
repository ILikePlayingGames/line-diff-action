// eslint.config.mjs
// @ts-check

import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

export default [
  eslint.configs.recommended,
  stylistic.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
    },
    ignores: [
      'dist/*',
      'lib/*',
    ],
  },
]
