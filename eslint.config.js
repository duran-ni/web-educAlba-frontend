import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    rules: {
      // Permite nombres de componente de una sola palabra (ej. App.vue)
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    // Archivos de configuracion que se ejecutan en entorno Node (no navegador),
    // por eso necesitan la variable global "process"
    files: ['*.config.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]
