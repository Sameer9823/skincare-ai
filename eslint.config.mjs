import { defineConfig } from 'eslint/config'
import nextPlugin from '@next/eslint-plugin-next'

const config = defineConfig([
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-html-link-for-pages': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
])

export default config
