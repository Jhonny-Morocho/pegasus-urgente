<template>
<hr>
<main class="grid w-full px-3">
  <ul class="col-12 md:col-6 flex flex-column gap-3">
    <li>
      <strong>Fecha: </strong>
      {{ formatoFecha(data?.fechaActividad) }}
    </li>
    <li>
      <strong>Tipo de Diligencia: </strong>
      {{ data?.nombreSubTipoActividad || 'N/A' }}
    </li>
    <li>
      <strong>Institución Ejecutora: </strong>
      {{ data?.nombreUnidadEjecutora || 'N/A' }}
    </li>
  </ul>
  <ul class="col-12 md:col-6 flex flex-column gap-3">
    <li>
      <strong>Estado: </strong>
      {{ data?.nombreEstado || 'N/A' }}
    </li>
    <li class="flex justify-content-start align-items-center">
      <strong>Solicitud de Diligencia: </strong>
      <span>
        <Button
          class="p-button-text p-0 text-2xl"
          :disabled="!data?.idDocumentoSolicitud"
          icon="pi pi-file"
          @click="verSolicitud(data)"
        />
      </span>
    </li>
    <li class="flex justify-content-start align-items-center">
      <strong>Resultado Diligencia</strong>
      <span>
        <Button
          class="p-button-text p-0"
          disabled
          icon="pi pi-file"
          @click="verResultado(data)"
        />
      </span>
    </li>
  </ul>
  <ul class="col-12 flex flex-column gap-3">
    <li>
      <strong>Descripción: </strong>
      <p>{{ data?.descripcion || 'Sin Descripción' }}</p>
    </li>
  </ul>
</main>
</template>

<script setup>
import { useDynamicDialog } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import ModalVerDocumento from '@/modules/global/components/documentos/ModalVerDocumento.vue'
import { dateTimeUtil } from '@/utils'
import { defineProps } from 'vue'

defineProps({
  data: propTypes.object
})

const { launchDynamicDialog } = useDynamicDialog()

function formatoFecha (fecha) {
  if (fecha) {
    return dateTimeUtil.formatToFrontend(fecha)
  }
}

function verSolicitud (diligencia) {
  launchDynamicDialog({
    component: ModalVerDocumento,
    header: 'Cargando Documento Solicitud...',
    data: {
      idDocumentoSolicitud: diligencia?.idDocumentoSolicitud
    }
  })
}
function verResultado (diligencia) {
  console.log('🚀 ~ file: ModalVerDiligencia.vue ~ line 92 ~ diligencia', diligencia)
}
</script>
<style scoped lang="scss">
li {
  list-style: none;
}
</style>
