<template>
  <div class="footer-contact">
    <h2 class="footer-contact__heading">Contacto</h2>
    <ul class="footer-contact__list">
      <li class="footer-contact__item">
        <span class="footer-contact__label">Dirección:</span>
        C/ Cooperativa Pablo Iglesias, 2 bajo 10 33920 Riaño-Langreo
      </li>
      <li class="footer-contact__item">
        <span class="footer-contact__label">Teléfono:</span>
        <a href="tel:+34622291309" class="footer-contact__link">+34 622 29 13 09</a>
      </li>
      <li class="footer-contact__item">
        <span class="footer-contact__label">Email:</span>
        <a href="mailto:refuerzoeducalba@gmail.com" class="footer-contact__link">refuerzoeducalba@gmail.com</a>
      </li>
    </ul>
  </div>
</template>

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

  &__label {
    font-weight: 600;
    margin-right: 0.375rem;
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
