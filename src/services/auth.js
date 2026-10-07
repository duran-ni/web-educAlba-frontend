import http from './http'

// Inicia sesion enviando las credenciales como cabecera HTTP Basic Auth en
// esta unica peticion. Si son correctas, el backend crea la sesion (cookie
// JSESSIONID) y devuelve los datos del usuario autenticado; las peticiones
// siguientes ya no necesitan volver a enviar la contraseña, viajan con esa
// cookie automaticamente (gracias a "withCredentials: true" en http.js).
// skipAuthRedirect: unas credenciales incorrectas ya devuelven un 401 que la
// propia pantalla de login gestiona (ver LoginForm.vue); no hace falta que
// el interceptor global intente redirigir tambien a "login" en ese caso
export function login(credentials) {
  return http.get('/auth/me', {
    auth: {
      username: credentials.email,
      password: credentials.password,
    },
    skipAuthRedirect: true,
  })
}

// Cierra la sesion en el backend: invalida la sesion del servidor y borra
// la cookie JSESSIONID. No hace falta volver a enviar credenciales, la
// propia cookie de sesion ya identifica al usuario que se quiere desconectar
export function logout() {
  return http.post('/auth/logout')
}

// Comprueba si ya existe una sesion activa en el backend (cookie JSESSIONID
// valida), sin enviar credenciales: si el navegador aun conserva esa cookie,
// el backend devuelve los datos del usuario sin pedir nada mas.
// skipAuthRedirect: un 401 aqui es un resultado normal (visitante sin sesion
// iniciada), no un error que deba forzar una redireccion a "login"
export function getCurrentUser() {
  return http.get('/auth/me', { skipAuthRedirect: true })
}

// Registra una nueva cuenta de familia junto con los datos del alumno/a.
// La contraseña viaja codificada en Base64 (no en texto plano) en el cuerpo
// de la peticion, igual que espera RegisterRequest en el backend; ahi se
// decodifica y se cifra de verdad con bcrypt antes de guardarla.
export function register(payload) {
  return http.post('/auth/register', {
    ...payload,
    password: btoa(payload.password),
  })
}
