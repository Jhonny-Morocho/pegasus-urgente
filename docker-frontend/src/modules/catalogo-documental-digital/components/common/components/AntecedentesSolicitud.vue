<template>
<div class="col-12 md:col-12 p-fluid grid">
  <div class="col-4">
    <strong> Id de Solicitud: </strong> {{ data?.idSolicitud }}
  </div>

  <div class="col-4">
    <strong class=""> Solicitante: </strong>{{ data?.solicitante?.nombre }}
  </div>

  <div
    v-if="esAnalisisfiscal"
    class="col-4"
  >
    <strong class=""> Fiscalía: </strong>{{ data?.solicitante?.fiscalia }}
  </div>

  <div class="col-4">
    <strong class=""> Id Catálogo: </strong>{{ data?.catalogo?.id }}
  </div>

  <div class="col-4">
    <strong> Nombre catálogo: </strong>{{ data?.catalogo?.nombre_catalogo }}
  </div>

  <div class="col-4">
    <strong class=""> Fecha de Solicitud: </strong>{{ formatDate(data?.solicitud?.fecha_creacion) }}
  </div>
  <div
    v-if="esAnalisisfiscal"
    class="col-4"
  >
    <strong class=""> Comentarios a la actualización: </strong>{{ data?.solicitud?.comentariosActualizacion || "Sin Comentarios" }}
  </div>
</div>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'

defineProps({
  data: propTypes.object,
  esAnalisisfiscal: Boolean
})
function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
</script>
