<template>
<AppFieldset
  class="p-fluid"
  legend="Antecedentes del Solicitante"
>
  <div class="col-12 grid w-full p-fluid">
    <div class="col-4">
      <p>
        <strong>Solicitante: </strong>
        <span
          class="link"
          @click="openDetallesSolicitante"
        >
          {{ data?.solicitante?.nombre || data?.nombre }}
        </span>
      </p>
    </div>
    <div class="col-4">
      <p>
        <strong>Fiscalía: </strong>{{ data?.solicitante?.fiscalia || data?.fiscalia }}
      </p>
    </div>
    <div class="col-4">
      <p>
        <strong>Fecha de Solicitud: </strong>{{ formatDate(data?.solicitud?.fechaCreacion) }}
      </p>
    </div>
  </div>
</AppFieldset>
</template>

<script setup>
// COMPONENTS
import ModalDetallesSolicitante from '@/modules/catalogo-documental-digital/components/common/modal/ModalDetallesSolicitante'

// UTILS
import { defineProps } from 'vue'

// COMPOSABLES
import { dateTimeUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useAppDialog } from '@/modules/common/composables'
const { launchDialog } = useAppDialog()

// VALUES
defineProps({
  data: propTypes.object
})
// LOGIC
function openDetallesSolicitante () {
  launchDialog({
    component: ModalDetallesSolicitante,
    header: 'Detalles del Solicitante',
    width: '60%',
    cancelLabel: 'Cerrar'
  })
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontend(date)
}
</script>

<style scoped>
.link {
  color: #2c6ddf;
  cursor: pointer;
}
</style>
