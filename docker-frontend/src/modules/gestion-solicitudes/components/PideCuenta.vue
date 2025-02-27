<template>
<AppFieldset
  class="w-full"
  :legend="title"
>
  <div class="col-12 flex">
    <div class="col-6 mb-2">
      <div class="flex flex-column px-1">
        <p class="mb-3">
          <strong>Fecha de Envío: </strong>{{ data?.fechaEnvio }}
        </p>
        <p class="my-3">
          <strong>Nuevo Plazo Otorgado: </strong>{{ data?.nuevoPlazo }}
        </p>
        <p class="mt-3">
          <strong>Institución Ejecutora:  </strong>{{ data?.institucionEjecutora }}
        </p>
      </div>
    </div>
  </div>
  <div
    class="col-12 flex justify-content-end py-0"
  >
    <div>
      <Button
        class="p-button-outlined"
        icon="pi pi-file"
        icon-pos="right"
        :label="buttonLabel"
        @click="handleVerSolicitud"
      />
    </div>
  </div>
</AppFieldset>
</template>
<script setup>
import defineProps from 'vue'
// composables
import { useAppDialog } from '@/modules/common/composables'
// components
import ModalVerDocumento from '@/modules/global/components/modals/ModalVerDocumento.vue'

const { launchDialog } = useAppDialog()

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  buttonLabel: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    required: true
  },
  docUrl: {
    type: String,
    default: null
  }
})

function handleVerSolicitud () {
  launchDialog({
    component: ModalVerDocumento,
    header: 'Ver Solicitud',
    props: {
      docUrl: props.docUrl
    },
    width: '67%'
  })
}
</script>
