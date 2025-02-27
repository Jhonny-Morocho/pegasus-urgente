<template>
<AppFieldset
  class="w-full"
  legend="Antecedentes de la Solicitud"
>
  <div class="col-12 flex">
    <div class="col-6 mb-2">
      <div class="flex flex-column px-1">
        <p class="mb-3">
          <strong>Motivo de Solicitud: </strong>{{ data.nombreSubtipoActividad + " " + data.nombreSubSubtipoActividad }}
        </p>
        <p
          v-if="data.accionCierre"
          class="my-3"
        >
          <strong>Acción de Cierre: </strong>{{ data.accionCierre || "Aun no se sabe que onda con este campo" }}
        </p>
        <p class="my-3">
          <strong>Fiscal desea Revisar el Escrito: </strong>{{ data.seRevisaEscrito ? "Si" : "No" }}
        </p>
      </div>
    </div>
    <div class="col-6 mb-2">
      <div class="flex flex-column px-1">
        <p class="mb-3">
          <strong>Víctima(s): </strong>{{
            data.infoRelacionesDelito && data.infoRelacionesDelito.length > 0
              ? data?.infoRelacionesDelito[0].nombreVictima
              : "No disponibles"
          }}
        </p>
        <p class="my-3">
          <strong>Imputado(s): </strong>{{
            data.infoRelacionesDelito && data.infoRelacionesDelito.length > 0
              ? data?.infoRelacionesDelito[0].nombreImputado
              : "No disponibles"
          }}
        </p>
        <p class="my-3">
          <strong>Delito(s): </strong>{{
            data.infoRelacionesDelito && data.infoRelacionesDelito.length > 0
              ? data?.infoRelacionesDelito[0].nombreDelito
              : "No disponibles"
          }}
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
            {{ data.instruccionFiscal || "No disponible" }}
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
        motivoSolictud: 'motivoSolicitud',
        accionCierre: '',
        fiscalRevisarEscrito: '',
        victima: '',
        imputado: '',
        delito: ''
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
