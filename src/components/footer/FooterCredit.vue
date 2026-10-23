<template>
  <p class="footer-credit">
    Diseñado y desarrollado por
    <a
      class="footer-credit__link"
      href="https://github.com/duran-ni"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Perfil de GitHub de duran-ni (se abre en una pestaña nueva)"
    >
      <span class="footer-credit__name">duran-ni</span>
      <svg class="footer-credit__icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
        />
      </svg>
    </a>
  </p>
</template>

<script setup></script>

<style lang="scss">
.footer-credit {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-size: 1rem;
  color: $color-text-dark;

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: $color-primary;
    font-weight: 600;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }

  &__name {
    font-family: $font-heading;
    font-size: 1.3em;
    font-weight: 700;
  }

  &__icon {
    width: 1rem;
    height: 1rem;
    fill: currentColor;
  }
}
</style>
