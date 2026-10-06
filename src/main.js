import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './styles/main.scss'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())

// Antes de instalar el router (que, al instalarse, dispara su navegacion
// inicial y con ella el guard de autenticacion) comprobamos si el navegador
// ya tiene una sesion activa. Asi, cuando el guard se ejecute por primera
// vez, "authStore.isAuthenticated" ya refleja la realidad, y un simple
// refresco de pagina en /admin o /dashboard no expulsa a quien si tiene
// sesion valida
const authStore = useAuthStore()

authStore.checkSession().finally(() => {
  app.use(router)
  app.mount('#app')
})
