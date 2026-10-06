import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as loginRequest, logout as logoutRequest } from '@/services/auth'

// Store de autenticacion: guarda los datos del usuario que ha iniciado sesion
// (id, email, roles), disponibles para cualquier componente de la aplicacion
// sin tener que pasarlos de padres a hijos a mano
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => user.value !== null)

  async function login(credentials) {
    const response = await loginRequest(credentials)
    user.value = response.data
  }

  // Cierra la sesion: avisa al backend para que invalide la sesion real y,
  // tanto si la peticion tiene exito como si falla (p. ej. la sesion ya
  // habia caducado), limpia igualmente el usuario guardado en el frontend
  async function logout() {
    try {
      await logoutRequest()
    } finally {
      user.value = null
    }
  }

  return { user, isAuthenticated, login, logout }
})
