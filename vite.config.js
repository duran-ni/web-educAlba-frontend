import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/abstracts/variables" as *; @use "@/styles/abstracts/mixins" as *;`,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3000',
      },
    },
    exclude: ['**/node_modules/**', '**/e2e/**'],
    // Se sube de los 5000ms por defecto porque App.spec.js monta la
    // aplicación completa y navega de verdad por el router; con la suite
    // ya grande, el test más pesado (la primera navegación a "home",
    // que compila en frío el import() perezoso de HomeView) puede rozar
    // ese límite en una máquina cargada
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})
