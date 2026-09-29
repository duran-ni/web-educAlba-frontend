import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import { submitContactMessage } from '../contact'

vi.mock('../http', () => ({
  default: { post: vi.fn() },
}))

describe('contact service', () => {
  it('posts the contact message data to the public endpoint', () => {
    submitContactMessage({
      name: 'Ana García',
      email: 'ana@example.com',
      subject: 'Solicitud de tutoría personalizada',
      message: 'Hola, me gustaría más información.',
    })

    expect(http.post).toHaveBeenCalledWith('/public/contact-messages', {
      name: 'Ana García',
      email: 'ana@example.com',
      subject: 'Solicitud de tutoría personalizada',
      message: 'Hola, me gustaría más información.',
    })
  })
})
