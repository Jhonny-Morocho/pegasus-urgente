<template>
<div class="grid w-full ml-6 my-2">
  <div class="col-4">
    <strong>Solicitante: </strong>
    <span
      class="link"
      @click="openDetallesSolicitante"
    >
      {{ data?.solicitante?.nombre }}
    </span>
  </div>
  <div class="col-4">
    <strong>ID Catálogo: </strong> {{ data?.solicitud?.id_catalogo }}
  </div>
  <div class="col-4">
    <strong>Fecha de Solicitud: </strong>
    {{ formatDate(data?.solicitud?.fecha_creacion) }}
  </div>
  <div class="col-4">
    <strong>Evidencia: </strong>
    {{ data?.archivo?.data?.esEvidencia === 1 ? 'Si' : 'No' }}
  </div>
  <div class="col-4">
    <strong>Fiscalía: </strong> {{ data?.solicitante?.fiscalia }}
  </div>
  <div class="col-4">
    <strong>Nombre Catálogo: </strong>
    {{ data?.catalogo?.nombre_catalogo }}
  </div>
  <div
    v-if="esBodegaTemporal"
    class="col-4"
  >
    <strong>Destino: </strong>
    {{
      getDescripcionMantenedorById(
        destinosDocumentosFisicos,
        data?.solicitud.destino
      )
    }}
  </div>
</div>
</template>
<script setup>
import { useAppDialog } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'
import ModalDetallesSolicitante from '@/modules/catalogo-documental-digital/components/common/modal/ModalDetallesSolicitante'
import { useMantenedorHelper } from '@/modules/global/composables'
import { useMantenedorCDD } from '../../composables'
import { dateTimeUtil } from '@/utils'

const { launchDialog } = useAppDialog()
const props = defineProps({
  data: propTypes.object,
  esBodegaTemporal: propTypes.boolean
})
const { destinosDocumentosFisicos } = useMantenedorCDD()
function formatDate (date) {
  if (!date) {
    return ''
  }
  return dateTimeUtil.formatToFrontendWithTime(date)
}
const { getDescripcionMantenedorById } = useMantenedorHelper()
console.log(props)
function openDetallesSolicitante () {
  launchDialog({
    component: ModalDetallesSolicitante,
    header: 'Detalles del Solicitante',
    width: '50%',
    cancelLabel: 'Cerrar'
  })
}
</script>
<style scoped>
.link {
  color: #2c6ddf;
  cursor: pointer;
}
</style>
