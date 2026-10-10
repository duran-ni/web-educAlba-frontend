<template>
  <div class="contact-view">
    <header class="contact-heading">
      <svg class="contact-heading__star" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 10C50 30 70 50 90 50C70 50 50 70 50 90C50 70 30 50 10 50C30 50 50 30 50 10Z" />
      </svg>
      <h1 class="contact-heading__title">
        ¡Hablemos!
        <span class="contact-heading__highlight" aria-hidden="true"></span>
      </h1>
      <p class="contact-heading__subtitle">
        ¿Tienes dudas, ideas o simplemente quieres saludar? Escríbenos, nos encanta leerte.
      </p>
    </header>

    <div class="contact-view__grid">
      <ContactForm :initial-subject="initialSubject" />

      <section class="contact-info">
        <h2 class="contact-info__title">Dónde estamos</h2>

        <a
          class="contact-info__map-link"
          :href="mapLinkUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir la ubicación de EducAlba en Google Maps"
        >
          <iframe
            class="contact-info__map"
            :src="mapEmbedUrl"
            title="Mapa de ubicación de EducAlba"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            tabindex="-1"
          ></iframe>
        </a>

        <p class="contact-info__address">
          <span class="contact-info__label">Dirección</span>
          {{ CONTACT.address }}
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ContactForm from '@/components/ContactForm.vue'
import { CONTACT } from '@/config/contact'

const route = useRoute()

// Si se llega desde un enlace con "?subject=...", precargamos el asunto del formulario
// (por ejemplo, desde el boton "Reserva una tutoria" de la pagina de Refuerzo)
const initialSubject = computed(() => {
  const subject = route.query.subject
  return typeof subject === 'string' ? subject : ''
})

// Version de la direccion formateada especificamente para que Google Maps la
// localice bien (con comas entre calle, codigo postal, localidad, provincia y
// pais). No se muestra en pantalla: solo se usa para construir las URLs del
// mapa. El texto que ve la persona sigue siendo CONTACT.address, tal cual.
const MAP_SEARCH_ADDRESS = 'Urbanización Cooperativa Pablo Iglesias, 2, 33920 Riaño, Langreo, Asturias, España'

// URL del mapa embebido de Google Maps, generada a partir de la direccion
// formateada para busquedas (MAP_SEARCH_ADDRESS)
const mapEmbedUrl = computed(() => `https://www.google.com/maps?q=${encodeURIComponent(MAP_SEARCH_ADDRESS)}&output=embed`)

// URL real de Google Maps (no la de "embed") para abrir la ubicacion en una pestana nueva al hacer clic
const mapLinkUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_SEARCH_ADDRESS)}`)
</script>

<style lang="scss">
.contact-heading {
  position: relative;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 7rem;

  @include respond-to(tablet) {
    margin-top: 3rem;
  }

  &__title {
    position: relative;
    z-index: 1;
    display: inline-block;
    margin: 3rem 0 0;
    font-family: $font-doodle;
    font-size: 4rem;
    color: $color-primary;
  }

  &__highlight {
    position: absolute;
    left: 0;
    bottom: -0.25rem;
    width: 100%;
    height: 0.5rem;
    background-color: $color-accent-yellow;
    opacity: 0.5;
    transform: rotate(-2deg);
    z-index: -1;
  }

  &__subtitle {
    max-width: 45rem;
    margin: 5rem auto 0;
    padding: 1.5rem 1.5rem;
    border: 2px dashed $color-text-dark;
    border-radius: 1rem;
    background-color: rgba($color-background, 0.8);
    font-family: $font-body;
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-text-dark;
  }

  &__star {
    display: none;
    position: absolute;
    top: 3rem;
    left: 3rem;
    width: 10rem;
    height: auto;
    fill: $color-accent-yellow;
    pointer-events: none;

    @include respond-to(tablet) {
      display: block;
    }
  }
}

.contact-view {
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 64rem;
    margin: 0 auto;
    padding: 0 1.5rem 3rem;

    @include respond-to(desktop) {
      grid-template-columns: 1fr 1fr;
      align-items: start;
    }
  }
}

.contact-info {
  padding: 1.5rem;
  border: 2px dashed $color-text-dark;
  border-radius: 1rem;
  background-color: $color-background-soft;
  transform: translateX(7rem);

  &__title {
    margin: 0 0 1rem;
    font-family: $font-doodle;
    font-size: 1.5rem;
    color: $color-primary;
  }

  &__address {
    margin: 0 0 1rem;
    margin-top: 2rem;
    font-family: $font-body;
    font-size: 1rem;
    color: $color-text-dark;
  }

  &__label {
    display: block;
    margin-bottom: 0.25rem;
    font-family: $font-heading;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $color-primary;
  }

  &__map-link {
    display: block;
    border: 2px solid $color-text-dark;
    border-radius: 0.75rem;
    overflow: hidden;
  }

  &__map {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    border: none;
    pointer-events: none;
  }
}
</style>
