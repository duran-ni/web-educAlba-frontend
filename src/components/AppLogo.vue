<template>
  <p class="app-logo">{{ message }}</p>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss">
.app-logo {
  font-family: $font-heading;
}
</style>
