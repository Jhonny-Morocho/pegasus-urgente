<template>
<section>
  <hr>
  <AppFieldset
    class="my-5"
    legend="Diligencias"
  >
    <TablaDiligenciasModal
      v-model:first="diligencias.first"
      :is-ejecutadas="isEjecutadas"
      :loading="diligencias.isLoading"
      :rows="diligencias.paginacion?.tamanoPagina"
      :total-records="diligencias.paginacion?.elementosTotales"
      :value="diligencias.data"
      @page="getDiligencias"
      @ver-resultado="verResultadoDiligencia"
      @ver-solicitud="verSolicitudDiligencia"
    />
  </AppFieldset>
  <AppFieldset
    class="mb-5"
    legend="Solicitudes"
  >
    <TablaAntecedentesSolicitadosModal
      v-model:first="solicitudes.first"
      :is-ejecutadas="isEjecutadas"
      :loading="solicitudes.isLoading"
      :rows="solicitudes.paginacion?.tamanoPagina"
      :total-records="solicitudes.paginacion?.elementosTotales"
      :value="solicitudes.data"
      @page="getAntecedentesSolicitados"
      @ver-resultado="verResultadoAntecedente"
      @ver-solicitud="verSolicitudAntecedente"
    />
  </AppFieldset>
</section>
</template>

<script setup>
import { computed, inject, onMounted, reactive } from 'vue'
import { requestUtil } from '@/utils/request.util.js'
import { useDynamicDialog } from '@/modules/common/composables'
import { useActividadStore } from '@/modules/global/composables'
import TablaDiligenciasModal from '@/modules/dirigir-investigacion/components/desarrollo-de-la-investigacion/TablaDiligenciasModal.vue'
import TablaAntecedentesSolicitadosModal from '@/modules/dirigir-investigacion/components/desarrollo-de-la-investigacion/TablaAntecedentesSolicitadosModal.vue'
import ModalVerDocumento from '@/modules/global/components/documentos/ModalVerDocumento.vue'

const { launchDynamicDialog } = useDynamicDialog()

const dialogRef = inject('dialogRef')

const props = reactive({
  ...dialogRef.value?.data
})

const idCausa = computed(() => props?.idCausa)
const isEjecutadas = computed(() => props?.isEjecutadas || false)

const diligencias = reactive({
  isLoading: false,
  first: 0,
  data: [],
  paginacion: null
})

const solicitudes = reactive({
  isLoading: false,
  first: 0,
  data: [],
  paginacion: null
})

const { actividad_getActividades } = useActividadStore()

function getActividades ({ actividad, pagination, codigoTipoActividad }) {
  if (!pagination) {
    actividad.first = 0
  }

  requestUtil({
    action: actividad_getActividades,
    payload: {
      params: {
        'id-origen-actividad': idCausa.value,
        'cod-tipo-actividad': codigoTipoActividad,
        page: pagination?.page || 0,
        size: pagination?.rows || 5,
        'cod-estados': isEjecutadas.value ? '3,8' : '1,7,3,8' // 1: EN_PREPARACION, 7: INGRESADA, 3: APROBADA, 8: CUMPLIDA (Dejar el que corresponda cuando el endpoint funcione como corresponde, hint: isEjecutadas)
      }
    },
    loader: (l) => {
      actividad.isLoading = l
    },
    resolve: ({ data, paginacion }) => {
      actividad.data = data
      actividad.paginacion = paginacion
    }
  })
}

function getDiligencias (pagination = undefined) {
  getActividades({
    pagination,
    actividad: diligencias,
    codigoTipoActividad: '26' // CODIGO 26: DILIGENCIAS
  })
}

function getAntecedentesSolicitados (pagination = undefined) {
  getActividades({
    pagination,
    actividad: solicitudes,
    codigoTipoActividad: '24' // CODIGO 24: SOLICITUDES
  })
}

onMounted(() => {
  getDiligencias()
  getAntecedentesSolicitados()
})

function verSolicitudDiligencia (diligencia) {
  launchDynamicDialog({
    component: ModalVerDocumento,
    header: 'Cargando Documento Solicitud...',
    data: {
      idDocumentoSolicitud: diligencia?.idDocumentoSolicitud
    }
  })
}

function verResultadoDiligencia (diligencia) {
  console.log('🚀 ~ file: ModalDiligenciasSolicitudes.vue:140 ~ verResultadoDiligencia ~ verResultadoDiligencia')
}

function verSolicitudAntecedente (antecedente) {
  launchDynamicDialog({
    component: ModalVerDocumento,
    header: 'Cargando Documento Solicitud...',
    data: {
      idDocumentoSolicitud: antecedente?.idDocumentoSolicitud
    }
  })
}

function verResultadoAntecedente (antecedente) {
  console.log('🚀 ~ file: ModalDiligenciasSolicitudes.vue:148 ~ verResultadoAntecedente ~ verResultadoAntecedente')
}
</script>
