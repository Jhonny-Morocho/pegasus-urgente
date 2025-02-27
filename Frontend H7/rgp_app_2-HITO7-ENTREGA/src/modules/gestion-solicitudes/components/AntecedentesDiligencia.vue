<template>
<AppFieldset
  class="w-full"
  legend="Antecedentes de la Diligencia"
>
  <div class="col-12 flex">
    <div class="col-6 mb-2">
      <div class="flex flex-column px-1">
        <p class="mb-3">
          <strong>Diligencia: </strong>{{ data.diligencia }}
        </p>
        <p class="my-3">
          <strong>Tipo Diligencia: </strong>{{ data.tipoDiligencia }}
        </p>
        <p class="my-3">
          <strong>Subtipo Diligencia: </strong>{{ data.subtipoDiligencia }}
        </p>
        <p class="mt-3 mb-2">
          <strong>Observación: </strong>{{ data.observación }}
          .............................................................
        </p>
        <p class="mt-3 my-3">
          <strong>Fiscal desea Revisar el Escrito: </strong>{{ data.fiscalDeseaRevisarEscrito }}
        </p>
      </div>
    </div>
    <div class="col-6 mb-2">
      <div class="flex flex-column px-1">
        <p class="mb-3">
          <strong>Ámbito: </strong>{{ data.ambito }}
        </p>
        <p class="my-3">
          <strong>RUT Sujeto: </strong>{{ data.rutSujeto }}
        </p>
        <p class="my-3">
          <strong>Institución Ejecutora: </strong>{{ data.instituciónEjecutora }}
        </p>
        <p class="mt-3">
          <strong>Plazo: </strong>{{ data.plazo }}
        </p>
      </div>
    </div>
  </div>
  <div
    v-if="!hideInstruccionesFiscal"
    class="col-12 p-3 pt-0"
  >
    <h2>Instrucciones Específicas para Materializar:</h2>
    <div class="pt-4">
      <div class="box">
        <div class="p-3">
          <strong>
            {{ data.instruccionesFiscal || 'No disponible' }}
          </strong>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="verSolicitud"
    class="col-12 flex justify-content-end"
  >
    <div>
      <Button
        class="p-button-outlined"
        icon="pi pi-file"
        icon-pos="right"
        label="Ver Solicitud"
        @click="handleVerSolicitud"
      />
    </div>
  </div>
</AppFieldset>
</template>
<script setup>
import { defineProps } from 'vue'
import { useAppDialog } from '@/modules/common/composables'
import ModalVerDocumento from '@/modules/global/components/modals/ModalVerDocumento.vue'

const props = defineProps({
  verSolicitud: Boolean,
  data: {
    type: Object,
    default: () => {
      return {
        diligencia: 14219507,
        tipoDiligencia: 'Informe de lesiones',
        subtipoDiligencia: 'Sin Subtipo',
        observación: 'la observación',
        fiscalDeseaRevisarEscrito: 'Si',
        ambito: 'Sujeto / Interviniente',
        rutSujeto: '15.456.555-0',
        instituciónEjecutora: 'Servicio Médico Legal',
        plazo: '30 días',
        instruccionesFiscal: ''
      }
    }
  },
  hideInstruccionesFiscal: Boolean,
  docUrl: {
    type: String,
    default: null
  }
})

const { launchDialog } = useAppDialog()

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

.box strong {
  line-height: 3rem;
  font-size: 16px;
}
</style>
