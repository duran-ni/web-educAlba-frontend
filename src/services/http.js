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

// Interceptor de respuesta: gestiona errores de autenticación de forma centralizada
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      router.push({ name: 'login' })
    }

    return Promise.reject(error)
  }
)

export default http
