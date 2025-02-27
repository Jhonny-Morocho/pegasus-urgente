<template>
<div
  class="col-12 md:col-6"
>
  <p><span>RUC:</span>{{ dataInstruccion?.data.ruc ?? dataCausa.causa?.rolUnico }}</p>
</div>
<div
  v-if="!dataCausa?.comprobante"
  class="col-12 md:col-6"
>
  <p><span>Fecha Creación Causa:</span>{{ dateTimeUtil.formatToFrontend(dataCausa?.fechaCreacionCausa) }}</p>
</div>
<div
  v-if="dataCausa?.comprobante"
  class="col-12 md:col-6"
>
  <p><span>Fecha de término:</span>{{ dateTimeUtil.formatToFrontend(dataCausa?.fechaTermino) }}</p>
</div>
<div
  v-if="dataCausa?.comprobante"
  class="col-12 md:col-6"
>
  <p><span>Fecha de Inspección:</span>{{ dateTimeUtil.formatToFrontend(dataCausa?.fechaInspeccion) }}</p>
</div>
<div
  v-if="dataCausa?.nombreCausa"
  class="col-12 md:col-6"
>
  <p><span>Nombre Causa:</span>{{ dataCausa?.nombreCausa }}</p>
</div>
<div
  v-if="dataCausa?.comprobante && !dataCausa?.comprobanteTermino"
  class="col-12 md:col-6"
>
  <p><span>Hora de Inicio Inspección:</span>{{ dataCausa?.horaInicioInspeccion }}</p>
</div>
<div
  v-if="dataCausa?.comprobante"
  class="col-12 md:col-6"
>
  <p><span>Solicitante de la Inspección:</span>{{ dataCausa?.solicitanteInspeccion }}</p>
</div>
<div
  v-if="dataCausa?.comprobante && !dataCausa?.comprobanteTermino"
  class="col-12 md:col-6"
>
  <p><span>Hora de Término Inspección:</span>{{ dataCausa?.horaTerminoInspeccion }}</p>
</div>
<div
  v-if="!dataCausa.esRegistrocheque"
  class="col-12 md:col-6"
>
  <p><span>Fiscalía Local:</span>{{ dataCausa?.fiscaliaLocal }}</p>
</div>
<div
  v-if="!dataCausa?.comprobante"
  class="col-12 md:col-6"
>
  <p><span>Estado de la causa:</span>{{ estadoCausa(dataCausa?.causa?.idEstado) ?? estadoCausa(dataCausa.estadoCausa) }}</p>
</div>
<div
  v-if="!dataCausa?.comprobante"
  class="col-12 md:col-6"
>
  <p v-if="dataInstruccion?.causa?.idFiscalAsignado === null">
    <span>Fiscal Asignado:</span>No tiene Fiscal Asignado
  </p>
  <p v-else>
    <span>Fiscal Asignado:</span>{{ dataInstruccion?.causa?.idFiscalAsignado ?? dataCausa.fiscalAsignado }}
  </p>
</div>
<div
  class="col-12 md:col-6"
>
  <p><span>Delito(s):</span></p>
  <p
    v-for="d in dataCausa?.hechoDelictuales"
    :key="d"
  >
    - {{ d.delito.familiaDelito }} / {{ d.delito.tipoDelito }}
  </p>
</div>
<div
  v-if="dataCausa?.comprobante"
  class="col-12"
>
  <p><span>Observaciones:</span>{{ dataCausa?.observaciones }}</p>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'

defineProps({
  dataCausa: propTypes.object,
  dataInstruccion: propTypes.object
})
const {
  mantenedor_getDescripcionEstadoCausaById
} = useMantenedorStore()
function estadoCausa (idEstadoCausa) {
  return mantenedor_getDescripcionEstadoCausaById(idEstadoCausa) || 'Estado Desconocido'
}
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
