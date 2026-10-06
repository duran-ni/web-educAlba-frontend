import http from './http'

// Inicia sesion enviando las credenciales como cabecera HTTP Basic Auth en
// esta unica peticion. Si son correctas, el backend crea la sesion (cookie
// JSESSIONID) y devuelve los datos del usuario autenticado; las peticiones
// siguientes ya no necesitan volver a enviar la contrasena, viajan con esa
// cookie automaticamente (gracias a "withCredentials: true" en http.js)
export function login(credentials) {
  return http.get('/auth/me', {
    auth: {
      username: credentials.email,
      password: credentials.password,
    },
  })
}
