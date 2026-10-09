import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

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
    // El codigo de src/ se ejecuta en el navegador, no en Node: aqui viven
    // objetos globales como window, document, EventSource o btoa
    files: ['src/**/*.{js,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
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
