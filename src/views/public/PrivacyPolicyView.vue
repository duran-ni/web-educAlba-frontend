<template>
  <article class="privacy-policy-view">
    <PageHeading
      title="Política de Privacidad"
      subtitle="Cómo tratamos los datos que nos facilitas al registrarte en EducAlba"
    />

    <div class="privacy-policy-view__body">
      <p>
        <strong>¿Quién es el responsable del tratamiento?</strong> Academia EducAlba es responsable
        del tratamiento de los datos personales facilitados a través de este formulario. Contacto:
        <a class="privacy-policy-view__link" href="mailto:refuerzoeducalba@gmail.com"
          >refuerzoeducalba@gmail.com</a
        >.
      </p>

      <p>
        <strong>¿Para qué tratamos tus datos?</strong> Los datos recogidos en el formulario de
        registro (nombre y apellidos del alumno/a, correo electrónico, etapa educativa y servicio de
        interés) se utilizan únicamente para gestionar el alta del alumno/a y la comunicación
        relacionada con los servicios de la academia (talleres y clases de refuerzo).
      </p>

      <p>
        <strong>¿Cuál es la base legal?</strong> El tratamiento se basa en el consentimiento
        explícito otorgado por la persona que realiza el registro, en representación del alumno/a
        menor de edad, al marcar la casilla de aceptación de esta política.
      </p>

      <p>
        <strong>¿Por cuánto tiempo conservaremos tus datos?</strong> Los datos se conservarán
        mientras la cuenta de familia permanezca activa, y se eliminarán a petición del usuario o
        tras un periodo de inactividad razonable.
      </p>

      <p>
        <strong>¿Cuáles son tus derechos?</strong> Puedes ejercer los siguientes derechos sobre tus
        datos, así como retirar el consentimiento en cualquier momento, escribiendo a
        <a class="privacy-policy-view__link" href="mailto:refuerzoeducalba@gmail.com"
          >refuerzoeducalba@gmail.com</a
        >:
      </p>
      <ul class="privacy-policy-view__list">
        <li>Acceder a tus datos personales.</li>
        <li>Solicitar la rectificación de los datos inexactos.</li>
        <li>Solicitar su supresión cuando ya no sean necesarios.</li>
        <li>Solicitar la limitación de su tratamiento.</li>
        <li>Oponerte al tratamiento de tus datos.</li>
        <li>Solicitar la portabilidad de tus datos.</li>
      </ul>

      <p>
        <strong>¿Se ceden tus datos a terceros?</strong> No se ceden datos personales a terceros,
        salvo obligación legal.
      </p>

      <p>
        <strong>¿Qué carácter tiene este documento?</strong> Este documento tiene finalidad
        educativa y no constituye asesoramiento legal profesional.
      </p>
    </div>
  </article>
</template>

<script setup>
import PageHeading from '@/components/PageHeading.vue'
</script>

<style lang="scss">
.privacy-policy-view {
  max-width: 48rem;
  margin: 0 auto;
  padding: 3rem 1.5rem;

  &__body {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: $font-body;
    font-size: 1.1rem;
    line-height: 1.6;
    color: $color-text-dark;

    strong {
      font-family: $font-heading;
      font-size: 1.05em;
      font-weight: 700;
      color: $color-text-dark;
    }
  }

  &__list {
    margin: -0.75rem 0 0;
    padding-left: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__link {
    color: $color-primary;
    font-weight: 600;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }
}
</style>
