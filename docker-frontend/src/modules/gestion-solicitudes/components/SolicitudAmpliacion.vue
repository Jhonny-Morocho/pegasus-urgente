<template>
<AppFieldset legend="Solicitud de Ampliación">
  <div class="col-12 flex">
    <div class="col-6 mb-2">
      <div class="flex flex-column px-1">
        <p class="mb-3">
          <strong>Fecha y Hora solicitud de ampliación: </strong>{{ data?.fechaEnvio }}
        </p>
        <p class="my-3">
          <strong>Plazo de Ampliación solicitado: </strong>{{ data?.nuevoPlazo }}
        </p>
        <p class="mt-3">
          <strong>Institución Ejecutora que solicita: </strong>{{ data?.institucionEjecutora }}
        </p>
      </div>
    </div>
  </div>
  <div class="col-12 flex justify-content-end py-0">
    <Button
      class="p-button-outlined"
      icon="pi pi-file"
      icon-pos="right"
      label="Ver Solicitud"
      @click="handleVerSolicitud"
    />
  </div>
  <div class="col-12">
    <div
      class="col-12 p-3 pt-0"
    >
      <h2>Texto Solicitud de Ampliación de Plazo</h2>
      <div class="pt-4">
        <div class="box">
          <div class="p-3">
            <strong />
          </div>
        </div>
      </div>
    </div>
  </div>
</AppFieldset>
</template>
<script setup>
import { defineProps } from 'vue'
import { useAppDialog } from '@/modules/common/composables'
import ModalVerDocumento from '@/modules/global/components/modals/ModalVerDocumento.vue'

const { launchDialog } = useAppDialog()

const props = defineProps({
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
<style scoped>
.box {
  border: 1px solid #000000;
  border-radius: 10px;
  height: 119px;
}
</style>
