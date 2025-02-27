<template>
<main>
  <hr>
  <MapInput
    :auto-complete="false"
    class="w-full mb-3 mt-2"
    :draggable="false"
    :position="direccionCoords"
    :zoom="18"
  />
  <AppFieldset
    class="px-3"
    legend="Dirección"
    no-margin-bottom
  >
    <ul class="col-12 md:col-6 flex flex-column gap-3">
      <li>
        <strong>Región: </strong>
        {{ region(direccionDelito?.region) }}
      </li>
      <li>
        <strong>Comuna: </strong>
        {{ comuna(direccionDelito?.comuna) }}
      </li>
      <li>
        <strong>Calle: </strong>
        {{ direccionDelito?.calle }}
      </li>
      <li>
        <strong>Número: </strong>
        {{ direccionDelito?.numero }}
      </li>
      <li>
        <strong>Ubicación Rural: </strong>
        {{ direccionDelito?.ubicacionRural ? 'Si' : 'No' }}
      </li>
      <li v-if="direccionDelito?.departamentoOficina ">
        <strong>Casa/Depto/Oficina: </strong>
        {{ direccionDelito?.departamentoOficina }}
      </li>
    </ul>
    <ul class="col-12 md:col-6 flex flex-column gap-3">
      <li>
        <strong>Cuadrante Policial: </strong>
        {{ direccionDelito?.cuadrante || 'N/A' }}
      </li>
      <li>
        <strong>Sector: </strong>
        {{ direccionDelito?.sector || 'N/A' }}
      </li>
      <li>
        <strong>Población o Villa: </strong>
        {{ direccionDelito?.poblacionVilla || 'N/A' }}
      </li>
      <li>
        <strong>Intersección: </strong>
        {{ direccionDelito?.interseccion || 'N/A' }}
      </li>
      <li>
        <strong>Observación de la Referencia: </strong>
        {{ direccionDelito?.observacionReferencia || 'N/A' }}
      </li>
    </ul>
  </AppFieldset>
</main>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { computed, defineProps } from 'vue'

const props = defineProps({
  direccionDelito: propTypes.object
})

const {
  mantenedor_getDescripcionComunasById,
  mantenedor_getDescripcionRegionById
} = useMantenedorStore()

const direccionCoords = computed(() => {
  return {
    latitude: props?.direccionDelito?.latitud,
    longitude: props?.direccionDelito?.longitud
  }
})

function comuna (value) {
  return mantenedor_getDescripcionComunasById(value)
}

function region (value) {
  return mantenedor_getDescripcionRegionById(value)
}
</script>
<style scoped lang="scss">
li {
  list-style: none;
}
</style>
