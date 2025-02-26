<template>
<hr>
<main class="px-4 mt-3">
  <section class="w-full flex flex-row-reverse">
    <Button
      class="p-button-outlined px-4"
      icon="pi pi-refresh"
      label="Actualizar"
      :loading="isLoading"
      @click="handleActualizar"
    />
  </section>

  <AppFieldset :legend="`Sujeto ${nombreSujeto}`">
    <section
      v-if="loadingState.infoSrcei"
      class="col-12 md:col-3"
    >
      <LoaderSkeleton height="34vh" />
    </section>
    <section
      v-else
      class="col-12 md:col-3"
    >
      <Image
        v-if="imagenSujetoBase64"
        id="imagen-sujeto-delictual"
        :alt="nombreSujeto"
        image-class="w-full"
        preview
        :src="`data:image/jpg;base64,${imagenSujetoBase64}`"
      />
      <img
        v-else
        id="imagen-sujeto-delictual"
        alt="img-sujeto-interviniente"
        class="w-full"
        src="@/assets/images/img-sujeto.jpg"
      >
    </section>
    <section class="col-12 md:col-4 px-3">
      <ul class="flex flex-column gap-2 list-none px-0">
        <li><strong>RUT: </strong>{{ format(numeroDocumento) }}</li>
        <li><strong>Tipo Documento: </strong>{{ descripcionTipoDocumento }}</li>
      </ul>
    </section>
    <section
      v-if="false"
      class="col-12 md:col-5"
    >
      <Message severity="warn">
        <strong>Atención</strong> Sujeto presenta órden de detención
      </Message>
    </section>
  </AppFieldset>

  <AppFieldset legend="Causas Asociadas">
    <TablaCausasAsociadas
      :loading="loadingState.getCausasAsociadas"
      :total-records="causasAsociadas?.length"
      :value="causasAsociadas"
    />
  </AppFieldset>

  <AppFieldset legend="Órdenes de Detención">
    <TablaOrdenesDetencion
      :loading="loadingState.getOrdenesDetencion"
      :total-records="ordenesDetencion?.resultado?.listaDatos?.length"
      :value="ordenesDetencion?.resultado?.listaDatos"
    />
  </AppFieldset>

  <AppFieldset legend="Formalización del Imputado">
    <TablaFormalizacionImputado
      :loading="loadingState.getFormalizaciones"
      :total-records="formalizaciones?.length"
      :value="formalizaciones"
    />
  </AppFieldset>

  <AppFieldset legend="Citaciones">
    <TablaCitacionesRelacionadas :value="[]" />
  </AppFieldset>

  <AppFieldset legend="Medidas Cautelares">
    <TablaMedidasCautelares
      :loading="loadingState.getMedidasCautelares"
      :total-records="medidasCautelares?.length"
      :value="medidasCautelares"
    />
  </AppFieldset>

  <AppFieldset legend="Sentencias">
    <TablaSentencias
      :loading="loadingState.getSentenciasAplicadas"
      :total-records="sentenciasAplicadas?.length"
      :value="sentenciasAplicadas"
    />
  </AppFieldset>

  <AppFieldset legend="Intervinientes Relacionados">
    <TablaIntervinientesRelacionados :value="[]" />
  </AppFieldset>

  <AppFieldset legend="Audiencias Programadas">
    <TablaAudienciasProgramadas
      :loading="loadingState.getAudienciasProgramadas"
      :total-records="audienciasProgramadas?.return?.length"
      :value="audienciasProgramadas?.return"
    />
  </AppFieldset>

  <AppFieldset legend="Detenciones Anteriores">
    <TablaDetencionesAnteriores
      :loading="loadingState.getDetencionesAnteriores"
      :total-records="detencionesAnteriores?.length"
      :value="detencionesAnteriores"
    />
  </AppFieldset>

  <AppFieldset legend="Resoluciones Aplicadas">
    <TablaResolucionesAplicadas
      :loading="loadingState.getResolucionesAplicadas"
      :total-records="resolucionesAplicadas?.length"
      :value="resolucionesAplicadas"
    />
  </AppFieldset>
</main>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { defineProps, computed, reactive, onMounted, ref } from 'vue'
import { format } from '@fiquu/cl-rut'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useInfoDelictualSujetoStore, useMantenedorStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import TablaCausasAsociadas from './informacion-delictual/TablaCausasAsociadas.vue'
import TablaOrdenesDetencion from './informacion-delictual/TablaOrdenesDetencion.vue'
import TablaFormalizacionImputado from './informacion-delictual/TablaFormalizacionImputado.vue'
import TablaMedidasCautelares from './informacion-delictual/TablaMedidasCautelares.vue'
import TablaSentencias from './informacion-delictual/TablaSentencias.vue'
import TablaIntervinientesRelacionados from './informacion-delictual/TablaIntervinientesRelacionados.vue'
import TablaCitacionesRelacionadas from './informacion-delictual/TablaCitacionesRelacionadas.vue'
import TablaDiligenciasSolicitadas from './informacion-delictual/TablaDiligenciasSolicitadas.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import TablaAudienciasProgramadas from './informacion-delictual/TablaAudienciasProgramadas.vue'
import TablaDetencionesAnteriores from './informacion-delictual/TablaDetencionesAnteriores.vue'
import TablaResolucionesAplicadas from './informacion-delictual/TablaResolucionesAplicadas.vue'

const props = defineProps({
  data: propTypes.object,
  ruc: propTypes.string
})

const {
  ordenesDetencion,
  medidasCautelares,
  audienciasProgramadas,
  formalizaciones,
  detencionesAnteriores,
  causasAsociadas,
  sentenciasAplicadas,
  resolucionesAplicadas,
  infoDelictualSujeto_getOrdenesDetencion,
  infoDelictualSujeto_getMedidasCautelares,
  infoDelictualSujeto_getAudienciasProgramadas,
  infoDelictualSujeto_getFormalizaciones,
  infoDelictualSujeto_getDetencionesAnteriores,
  infoDelictualSujeto_getCausasAsociadas,
  infoDelictualSujeto_getSentenciasAplicadas,
  infoDelictualSujeto_getResolucionesAplicadas
} = useInfoDelictualSujetoStore()

const {
  sujetosInvervinientes_getInformacionSrcel
} = useSujetosIntervinientesStore()

const { tiposDocumento } = useMantenedorStore()

const nombreSujeto = computed(
  () =>
    `${props.data?.nombres} ${props.data?.apellidoPaterno} ${props.data?.apellidoMaterno}`
)
const idTipoDocumento = computed(() => props.data?.tipoDocumento)

const descripcionTipoDocumento = computed(() => {
  const tipoDocumentoFound = tiposDocumento.value?.find(tipoDocumento => tipoDocumento?.id === idTipoDocumento.value)
  return tipoDocumentoFound?.descripcion
})

const numeroDocumento = computed(() => props.data?.numeroDocumento)

const loadingState = reactive({
  infoSrcei: true,
  getOrdenesDetencion: false,
  getMedidasCautelares: false,
  getAudienciasProgramadas: false,
  getFormalizaciones: false,
  getDetencionesAnteriores: false,
  getCausasAsociadas: false,
  getSentenciasAplicadas: false,
  getResolucionesAplicadas: false
})

const isLoading = computed(() => {
  const loadingValues = Object.values(loadingState)
  return loadingValues.some(loading => loading)
})

const imagenSujetoBase64 = ref(null)

function getInfoSrcei () {
  requestUtil({
    action: sujetosInvervinientes_getInformacionSrcel,
    payload: {
      tipoId: idTipoDocumento.value,
      numeroId: numeroDocumento.value
    },
    loader: (l) => {
      loadingState.infoSrcei = l
    },
    resolve: ({ fotografia }) => {
      imagenSujetoBase64.value = fotografia?.base64Data
    }
  })
}

function getOrdenesDetencion () {
  const [numero, dv] = numeroDocumento.value.split('-')

  requestUtil({
    action: infoDelictualSujeto_getOrdenesDetencion,
    payload: {
      // numeroRut: '12881487',
      // digitoVerificador: '6'
      numeroRut: numero,
      digitoVerificador: dv
    },
    loader: (l) => { loadingState.getOrdenesDetencion = l }
  })
}

function getMedidasCautelares () {
  requestUtil({
    action: infoDelictualSujeto_getMedidasCautelares,
    payload: {
      rut: numeroDocumento.value
      // rut: '21090045-4'
    },
    loader: (l) => { loadingState.getMedidasCautelares = l }
  })
}

function getAudienciasProgramadas () {
  requestUtil({
    action: infoDelictualSujeto_getAudienciasProgramadas,
    payload: {
      ruc: props.ruc
    },
    loader: (l) => { loadingState.getAudienciasProgramadas = l }
  })
}

function getFormalizaciones () {
  requestUtil({
    action: infoDelictualSujeto_getFormalizaciones,
    payload: {
      numeroDocumento: numeroDocumento.value
    },
    loader: (l) => { loadingState.getFormalizaciones = l }
  })
}

function getDetencionesAnteriores () {
  requestUtil({
    action: infoDelictualSujeto_getDetencionesAnteriores,
    payload: {
      numeroDocumento: numeroDocumento.value
    },
    loader: (l) => { loadingState.getDetencionesAnteriores = l }
  })
}

function getCausasAsociadas () {
  requestUtil({
    action: infoDelictualSujeto_getCausasAsociadas,
    payload: {
      numeroDocumento: numeroDocumento.value
    },
    loader: (l) => { loadingState.getCausasAsociadas = l }
  })
}

function getSentenciasAplicadas () {
  requestUtil({
    action: infoDelictualSujeto_getSentenciasAplicadas,
    payload: {
      numeroDocumento: numeroDocumento.value
    },
    loader: (l) => { loadingState.getSentenciasAplicadas = l }
  })
}

function getResolucionesAplicadas () {
  requestUtil({
    action: infoDelictualSujeto_getResolucionesAplicadas,
    payload: {
      numeroDocumento: numeroDocumento.value
    },
    loader: (l) => { loadingState.getResolucionesAplicadas = l }
  })
}

function handleActualizar () {
  getInfoSrcei()
  getOrdenesDetencion()
  getMedidasCautelares()
  getAudienciasProgramadas()
  getFormalizaciones()
  getDetencionesAnteriores()
  getCausasAsociadas()
  getSentenciasAplicadas()
  getResolucionesAplicadas()
}

onMounted(() => {
  handleActualizar()
})

</script>
