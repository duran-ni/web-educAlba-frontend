<template>
  <nav class="footer-social" aria-label="Redes sociales">
    <ul class="footer-social__list">
      <li class="footer-social__item">

          href="https://www.instagram.com/educa_lba?stkn=cWU2cHRiNWttdjZ5"
          class="footer-social__link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram de EducAlba"
        <a>
          <svg class="footer-social__icon" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
          </svg>
        </a>
      </li>
      <li class="footer-social__item">

          href="https://wa.me/34622291309?text=Hola%2C%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n"
          class="footer-social__link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir por WhatsApp a EducAlba"
        <a>
          <svg class="footer-social__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 3a9 9 0 0 0-7.75 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M8.5 8.5c0 4 3 7 7 7"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
</script>

<style lang="scss">
.footer-social {
  &__list {
    display: flex;
    list-style: none;
    gap: 1rem;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: $color-text-dark;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: $color-primary;
      background-color: $color-background-soft;
    }
  }

  &__icon {
    width: 22px;
    height: 22px;
  }
}
</style>
