<template>
<main class="w-full px-3">
  <ul class="grid px-3 mt-3 mb-5">
    <li class="col-12 md:col-6">
      <strong>Nombre: </strong>
      {{ nombreCompleto(data) }}
    </li>
    <li class="col-12 md:col-6">
      <strong>Calidad: </strong>
      {{ tipoSujeto(data?.tipoSujeto) }}
    </li>
  </ul>

  <AppFieldset
    legend="Lista de Representados"
    no-margin-bottom
  >
    <!-- FALTA APPFILTERS Y REPRESENTADOS -->
    <TablaSujetos
      class="w-full"
      is-representados
      :value="[]"
    />
  </AppFieldset>
</main>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import TablaSujetos from '../informacion-causa/TablaSujetos.vue'
import { useMantenedorStore } from '@/modules/global/composables'

defineProps({
  data: propTypes.object
})

const { mantenedor_getNombreTipoSujeto } = useMantenedorStore()

function nombreCompleto (data) {
  return `${data?.nombres} ${data?.apellidoPaterno} ${data?.apellidoMaterno}`.trim()
}

function tipoSujeto (idTipoSujeto) {
  return mantenedor_getNombreTipoSujeto(idTipoSujeto)
}
</script>

<style scoped lang="scss">
li {
  list-style: none;
}
</style>
