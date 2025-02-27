<template>
<AppFieldset
  class="col-12"
  legend="Información de la Denuncia"
>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold"> Tipo denuncia: </span>
    {{ mantenedor_getTipoDenunciaNombreById(mantenedor_getTipoDenunciaIdByCodigo(causaSeleccionada?.denuncia?.tipoDenuncia)) ?? 'N/A' }}
  </p>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold">Organismo colaborador: </span>
    {{ dataDenuncia?.idOrganismoColaboradorUnidad ?? 'N/A' }}
  </p>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold">Unidad Policial: </span>
    {{ dataDenuncia?.idUnidadPolicial ?? 'N/A' }}
  </p>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold">Funcionario a cargo: </span>
    {{ dataDenuncia?.numeroParteDenuncia ?? 'N/A' }}
  </p>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold">Cargo Funcionario: </span>
    {{ dataDenuncia?.idFuncionarioRol ?? 'N/A' }}
  </p>
  <p
    v-if="!dataDenuncia?.numeroParteDenuncia"
    class="col-12 md:col-4 lg:col-3"
  >
    <span class="fontbold">N° Parte/Denuncia: </span>
    {{ dataDenuncia?.numeroParteDenuncia ?? 'N/A' }}
  </p>
</AppFieldset>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { useCrearCausaStore } from '@/modules/ingreso/composables'
import { defineProps } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'

const { mantenedor_getTipoDenunciaNombreById, mantenedor_getTipoDenunciaIdByCodigo } = useMantenedorStore()
const { dataDenuncia, causaSeleccionada } = useCrearCausaStore()

defineProps({
  data: propTypes.array
})
</script>
<style scoped>
.fontbold {
  font-weight: bold;
}
</style>
