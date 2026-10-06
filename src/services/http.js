import axios from 'axios'

import router from '@/router'

// Instancia base de Axios configurada con la URL del backend.
// withCredentials permite que el navegador envíe y reciba la cookie
// de sesión (JSESSIONID) en cada petición, necesaria para Basic Auth
// con sesión por cookies (en vez de un token en localStorage).
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de respuesta: gestiona errores de autenticación de forma centralizada.
// skipAuthRedirect permite que ciertas peticiones (como la comprobacion silenciosa
// de sesion al arrancar la aplicacion) reciban un 401 sin forzar una redireccion,
// porque ahi un 401 es un resultado normal y esperado (visitante no autenticado),
// no una sesion que ha caducado a mitad de uso
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      router.push({ name: 'login' })
    }

    return Promise.reject(error)
  }
)

export default http
