<template>
<AppFieldset
  class="col-12"
  legend="Resumen de la Causa"
>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold"> Tipo Denuncia: </span>
    {{ mantenedor_getTipoDenunciaNombreById(mantenedor_getTipoDenunciaIdByCodigo(dataCausa?.codigoTipoDenuncia)) ?? 'N/A' }}
  </p>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold"> Fecha creación: </span>
    {{ dataCausa.fecha }}
  </p>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold"> Fecha asignación: </span>
    {{ dataCausa.fecha }}
  </p>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold"> Alerta: </span>
    {{ dataCausa.alerta ?? 'Sin alerta' }}
  </p>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold"> Etapa de la causa: </span>
    {{ estadoCausa(dataCausa?.idEstado) ?? 'N/A' }}
  </p>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold"> Cantidad de especies: </span>
    {{ especies?.length }}
  </p>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold"> Cantidad de sujetos: </span>
    {{ sujetosIntervinientes?.length }}
  </p>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold"> Cantidad de delitos: </span>
    {{ delitos?.length }}
  </p>
  <p class="col-12 md:col-4 lg:col-3">
    <span class="fontbold"> Cantidad de relaciones: </span>
    {{ relaciones?.length }}
  </p>
</AppFieldset>
</template>

<script setup>
import { computed } from 'vue'
import { useCrearCausaStore } from '@/modules/ingreso/composables'
import {
  useDelitoStore,
  useEspeciesDineroStore,
  useFichaCausaStore,
  useMantenedorStore,
  useRelacionesStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'

const { sujetosIntervinientes } = useSujetosIntervinientesStore()
const { relaciones } = useRelacionesStore()
const { especies } = useEspeciesDineroStore()
const { delitos } = useDelitoStore()
const { causaSeleccionada } = useFichaCausaStore()
const { causa } = useCrearCausaStore()
const { mantenedor_getTipoDenunciaIdByCodigo, mantenedor_getTipoDenunciaNombreById, mantenedor_getDescripcionEstadoCausaById } = useMantenedorStore()

const dataCausa = computed(() => {
  return causa.value ? causa.value : causaSeleccionada.value
})
console.log(dataCausa)

function estadoCausa (idEstadoCausa) {
  return mantenedor_getDescripcionEstadoCausaById(idEstadoCausa) || 'Estado Desconocido'
}
</script>
<style scoped>
.fontbold {
  font-weight: bold;
}
</style>
