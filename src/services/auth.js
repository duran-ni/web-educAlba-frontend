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

// Cierra la sesion en el backend: invalida la sesion del servidor y borra
// la cookie JSESSIONID. No hace falta volver a enviar credenciales, la
// propia cookie de sesion ya identifica al usuario que se quiere desconectar
export function logout() {
  return http.post('/auth/logout')
}
