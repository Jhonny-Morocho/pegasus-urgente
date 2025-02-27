<template>
<div class="grid col-12 md:col-6">
  <p class="col-12">
    <span class="font-bold"> NUE: </span>
    {{ data?.nue }}
  </p>
  <p class="col-12">
    <span class="font-bold"> RUE: </span>
    {{ data?.rue }}
  </p>
  <p class="col-12">
    <span class="font-bold"> RUC: </span>
    {{ data?.ruc }}
  </p>
  <p class="col-12">
    <span class="font-bold"> Familia Especie: </span>
    {{ familiaEspecie(data?.familiaEspecie) }}
  </p>
  <p class="col-12">
    <span class="font-bold"> Tipo Especie: </span>
    {{ tipoEspecie(data?.tipoEspecie) }}
  </p>
</div>
<div class="grid col-12 md:col-6">
  <p class="col-12">
    <span class="font-bold"> Cantidad: </span>
    {{ data?.cantidad }}
  </p>
  <p class="col-12">
    <span class="font-bold"> Descripción: </span>
    {{ data?.descripcion }}
  </p>
  <p class="col-12">
    <span class="font-bold"> Observación: </span>
    {{ data?.observacion }}
  </p>
  <p
    v-if="!!data?.marca"
    class="col-12"
  >
    <span class="font-bold"> Marca: </span>
    {{ data?.marca }}
  </p>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { defineProps } from 'vue'

defineProps({
  data: propTypes.object
})

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getFamiliaEspecies,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie
} = useMantenedorStore()

mantenedor_getFamiliaEspecies()
mantenedor_getAllTiposEspecie()

function familiaEspecie (idFamiliaEspecie) {
  return mantenedor_getNombreFamiliaEspecie(idFamiliaEspecie) ?? 'No definido'
}

function tipoEspecie (idTipoEspecie) {
  return mantenedor_getNombreTipoEspecie(idTipoEspecie) ?? 'No definido'
}
</script>
