<template>
  <div class="footer-contact">
    <h2 class="footer-contact__heading">Contacto</h2>
    <ul class="footer-contact__list">
      <li class="footer-contact__item">
        <svg class="footer-contact__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12Z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <circle cx="12" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
        {{ CONTACT.address }}
      </li>
      <li class="footer-contact__item">
        <svg class="footer-contact__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
        <a :href="CONTACT.phoneHref" class="footer-contact__link">{{ CONTACT.phone }}</a>
      </li>
      <li class="footer-contact__item">
        <svg class="footer-contact__icon" viewBox="0 0 24 24" aria-hidden="true">
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
        <a :href="CONTACT.emailHref" class="footer-contact__link">{{ CONTACT.email }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { CONTACT } from '@/config/contact.js'
</script>

<style lang="scss">
.footer-contact {
  &__heading {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
  }

  &__list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: $color-primary;
  }

  &__link {
    color: inherit;
    text-decoration: underline;

    &:hover,
    &:focus-visible {
      color: $color-primary;
    }
  }
}
</style>
