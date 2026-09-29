import http from './http'

// Envia el formulario de contacto al backend, que guarda el mensaje
// y dispara el aviso automatico por email a la academia
export function submitContactMessage(payload) {
  return http.post('/public/contact-messages', payload)
}
