import axios from 'axios'

import router from '@/router'

// Instancia base de Axios configurada con la URL del backend
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de petición: añade el token de autenticación si existe
// TODO: sustituir el acceso directo a localStorage por el useAuthStore
// cuando se implemente la Historia de Login
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Interceptor de respuesta: gestiona errores de autenticación de forma centralizada
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    }

    return Promise.reject(error)
  }
)

export default http
