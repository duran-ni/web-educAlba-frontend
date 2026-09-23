<template>
  <section class="quick-contact-cta">
    <h2 class="quick-contact-cta__heading">¡Aclara tus dudas!</h2>
    <div class="quick-contact-cta__links">
      <a :href="CONTACT.phoneHref" class="quick-contact-cta__link" aria-label="Llamar a EducAlba">
        <svg class="quick-contact-cta__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
        Llámanos
      </a>
      <a :href="CONTACT.emailHref" class="quick-contact-cta__link" aria-label="Escribir un email a EducAlba">
        <svg class="quick-contact-cta__icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
          <path
            d="M4 7l8 6 8-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Escríbenos
      </a>
    </div>
  </section>
</template>

<script setup>
import { CONTACT } from '@/config/contact.js'
</script>

<style lang="scss">
.quick-contact-cta {
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: $color-background-soft;
  text-align: center;

  &__heading {
    margin: 0 0 1rem;
    font-size: 1.25rem;
  }

  &__links {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.75rem;

    @include respond-to(tablet) {
      flex-direction: row;
    }
  }

  &__link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 999px;
    background-color: $color-primary;
    color: $color-background;
    text-decoration: none;
    font-weight: 600;
    transition: opacity 0.2s ease;

    &:hover,
    &:focus-visible {
      opacity: 0.9;
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
  }
}
</style>
