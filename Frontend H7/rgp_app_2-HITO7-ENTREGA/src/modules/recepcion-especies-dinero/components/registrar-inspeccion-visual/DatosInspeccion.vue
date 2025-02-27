<template>
<div class="grid col-12 lg:col-6">
  <div class="col-12">
    <p>
      <span>Fecha agendada de inspección:</span>{{ dateTimeUtil.formatToFrontend(datosInspeccion.fechaAgendada) }}
    </p>
  </div>
  <div class="col-12">
    <p>
      <span>Fecha de solicitud:</span>{{ dateTimeUtil.formatToFrontend(datosInspeccion.fechaSolicitud) }}
    </p>
  </div>
  <div class="col-12">
    <p>
      <span>Plazo esperado de respuesta:</span>{{ datosInspeccion.plazoEsperadoRespuesta }}
    </p>
  </div>
  <div class="col-12">
    <p>
      <span>Inspector que solicita:</span>{{ datosInspeccion.inspectorSolicita }}
    </p>
  </div>
</div>
<div class="col-12 lg:col-6">
  <span>Motivo Inspección:</span>
  <p>{{ datosInspeccion.motivoInspeccion }}</p>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'

defineProps({
  datosInspeccion: propTypes.object
})
</script>

<style scoped>
span {
  font-weight: bold;
  margin-right: 6px;
}
p {
  margin-top: 4px;
}
</style>
