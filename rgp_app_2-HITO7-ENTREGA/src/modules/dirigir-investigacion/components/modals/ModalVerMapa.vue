<template>
<section class="relative">
  <hr>
  <section class="absolute border-round-xs shadow-2 p-4 w-5 z-4 bg-white direccion-card">
    <h1 class="text-2xl font-medium mb-2">
      {{ direccion.calleNumero }}
    </h1>
    <h2 class="text-lg font-normal text-700">
      {{ direccion.completa }}
    </h2>
  </section>
  <MapInput
    id="map"
    :auto-complete="false"
    class="w-full"
    :draggable="false"
    height="h-30rem"
    :position="coordenadas"
    :zoom="18"
  />
</section>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { propTypes } from '@/modules/common/types'

const props = defineProps({
  coords: propTypes.object
})

const coordenadas = computed(() => {
  return {
    latitude: props?.coords?.latitud,
    longitude: props?.coords?.longitud
  }
})

const direccion = computed(() => {
  const calle = props?.coords?.calle
  const numero = props?.coords?.numero
  const comuna = props?.coords?.comunaNombre
  const region = props?.coords?.regionNombre

  return {
    calleNumero: `${calle} ${numero}`,
    completa: `${calle} ${numero}, ${comuna}, ${region}`
  }
})
</script>
<style scoped lang="scss">
.direccion-card {
  top: 20%;
  left: .825rem;
}
</style>
