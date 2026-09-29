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
        <ul class="contact-info__list">
          <li class="contact-info__item">
            <span class="contact-info__label">Dirección</span>
            {{ CONTACT.address }}
          </li>
          <li class="contact-info__item">
            <a class="contact-info__link" :href="CONTACT.phoneHref">
              <span class="contact-info__label">Teléfono</span>
              {{ CONTACT.phone }}
            </a>
          </li>
          <li class="contact-info__item">
            <a class="contact-info__link" :href="CONTACT.emailHref">
              <span class="contact-info__label">Email</span>
              {{ CONTACT.email }}
            </a>
          </li>
        </ul>
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
</script>

<style lang="scss">
.contact-heading {
  position: relative;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 3rem;

  @include respond-to(tablet) {
    margin-top: 3rem;
  }

  &__title {
    position: relative;
    z-index: 1;
    display: inline-block;
    margin: 1rem 0 0;
    font-family: $font-doodle;
    font-size: 3.5rem;
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
    max-width: 42rem;
    margin: 3rem auto 0;
    padding: 1rem 1.5rem;
    border: 2px dashed $color-text-dark;
    border-radius: 1rem;
    background-color: rgba($color-background, 0.8);
    font-family: $font-body;
    font-size: 1.125rem;
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

  &__title {
    margin: 0 0 1rem;
    font-family: $font-heading;
    font-size: 1.5rem;
    color: $color-primary;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
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

  &__link {
    display: block;
    color: inherit;
    text-decoration: none;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }
}
</style>
