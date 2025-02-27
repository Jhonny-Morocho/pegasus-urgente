<template>
<main>
  <AppFieldset legend="Identificación Especie/Dinero">
    <ul class="grid w-full px-3 pt-3 pb-0">
      <li class="col-12 md:col-6">
        <strong>Familia Especie: </strong>
        {{ familiaEspecie(data?.familiaEspecie) }}
      </li>
      <li class="col-12 md:col-6">
        <strong>Tipo Especie: </strong>
        {{ tipoEspecie(data?.idTipoEspecie) }}
      </li>
      <li class="col-12 md:col-6">
        <strong>Cantidad: </strong>
        {{ data?.cantidadEspecie }}
      </li>
      <li
        v-show="data?.unidadMedidaCuantitativa"
        class="col-12 md:col-6"
      >
        <strong>Unidad de Medida: </strong>
        {{ data?.unidadMedidaCuantitativa }}
      </li>
      <li class="col-12 md:col-6">
        <strong>Especie Peligrosa: </strong>
        {{ data?.especiePeligrosa ? 'Si' : 'No' }}
      </li>
      <li class="col-12 md:col-6">
        <strong>Especie Evidencia: </strong>
        {{ data?.indicadorEvidencia ? 'Si' : 'No' }}
      </li>
      <li class="col-12 md:col-6">
        <strong>Medio para cometer el Delito:</strong>
        {{ data?.indicadorMedioUsadoCometerDelito ? 'Si' : 'No' }}
      </li>
      <li class="col-12">
        <strong>Descripción: </strong>
        <p>{{ data?.descripcion || 'Sin Descripción' }}</p>
      </li>
    </ul>
  </AppFieldset>
  <AppFieldset
    v-show="false"
    legend="Características Especie/Dinero"
  >
    <!-- POR HACER, FALTA FIX ENDPOINT GET ESPECIE POR IDESPECIE  -->
  </AppFieldset>
</main>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { defineProps } from 'vue'

defineProps({
  data: propTypes.object
})

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie
} = useMantenedorStore()

function familiaEspecie (idFamiliaEspecie) {
  return mantenedor_getNombreFamiliaEspecie(idFamiliaEspecie)
}

function tipoEspecie (idTipoEspecie) {
  requestUtil({
    action: mantenedor_getAllTiposEspecie
  })
  return mantenedor_getNombreTipoEspecie(idTipoEspecie)
}
</script>
<style scoped lang="scss">
ul {
  list-style: none;
}
</style>
