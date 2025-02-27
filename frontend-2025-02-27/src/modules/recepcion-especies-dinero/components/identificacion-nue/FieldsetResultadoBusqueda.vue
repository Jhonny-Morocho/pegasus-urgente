<template>
<p class="col-12 md:col-4">
  <span class="font-bold">
    RUC:
  </span>
  {{ dataCausa?.rolUnico }}
</p>
<p class="col-12 md:col-4">
  <span class="font-bold">
    Estado de la Causa:
  </span>
  {{ estadoCausa(dataCausa?.idEstado) }}
</p>
<p class="col-12 md:col-4">
  <span class="font-bold">
    Fecha Creación Causa:
  </span>
  {{ formatDate(dataCausa?.fechaCreacion ?? dataCausa?.fecha) }}
</p>
<p class="col-12 md:col-4">
  <span class="font-bold">
    Nombre Causa:
  </span>
  {{ dataCausa?.nombre ?? "Causa sin nombre" }}
</p>
<p class="col-12 md:col-4">
  <span class="font-bold">
    Fiscal Asignado:
  </span>
  {{ dataCausa?.fiscalAsignado ?? 'Sin información' }}
</p>
<p class="col-12 md:col-4">
  <span class="font-bold">
    Nombre Fiscalía:
  </span>
  {{ dataCausa?.nombreFiscalia ?? 'Sin información' }}
</p>
<div class="col-12 flex">
  <span class="font-bold">
    {{ delitos?.length > 1 ? 'Delitos' : 'Delito:' }}
  </span>
  <p
    v-for="d in delitos"
    :key="d"
    class="mx-2"
  >
    {{ d.delito.tipoDelito }}
  </p>
</div>
<div class="col-12 flex">
  <span class="font-bold">
    RUE:
  </span>
  <p
    v-for="rue in rues"
    :key="rue"
    class="mx-2"
  >
    {{ rue }}
  </p>
</div>
<slot />
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { dateTimeUtil } from '@/utils'
import { defineProps, computed } from 'vue'

const {
  mantenedor_getDescripcionEstadoCausaById
} = useMantenedorStore()

function estadoCausa (idEstadoCausa) {
  return mantenedor_getDescripcionEstadoCausaById(idEstadoCausa) || 'Estado Desconocido'
}

const dP = defineProps({
  causa: propTypes.object,
  delitos: propTypes.object
})

const dataCausa = computed(() => dP.causa?.causa ?? dP.causa)

function formatDate (f) {
  return dateTimeUtil.formatToFrontendWithTime(f)
}
</script>
