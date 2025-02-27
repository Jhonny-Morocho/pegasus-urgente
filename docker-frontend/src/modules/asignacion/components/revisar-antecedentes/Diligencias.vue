<template>
<div class="p-fluid">
  <AppFieldset
    class="pb-3"
    legend="Lista de Diligencias Realizadas e Instruidas"
  >
    <TablaDiligenciasInstruidas
      id="diligencias-instruidas"
      v-model:first="diligencias.instruidasFirst"
      :loading="isLoading.diligenciasInstruidas"
      :rows="paginacionActividades?.tamanoPagina"
      :total-records="paginacionActividades?.elementosTotales"
      :value="actividades"
      @page="getDiligenciasInstruidas"
      @ver-documento="openModalVerDocumento"
    />
  </AppFieldset>
  <AppFieldset
    class="pb-3"
    legend="Diligencias Prioritarias Sugeridas"
  >
    <TablaDiligenciasSugeridas
      v-model:first="diligencias.sugeridasFirst"
      :loading="isLoading.diligenciasSugeridas"
      :rows="paginacionDiligenciasSugeridas?.tamanoPagina"
      :total-records="paginacionDiligenciasSugeridas?.elementosTotales"
      :value="diligenciasSugeridas"
      @instruir="openModalInstruirDiligencia"
      @page="getDiligenciasSugeridas"
    />
  </AppFieldset>
  <div class="col-3 mb-4">
    <Button
      icon="pi pi-external-link"
      icon-pos="right"
      label="Instruir Nueva Diligencia"
      :loading="isSomethingLoading"
      @click="openModalInstruirDiligencia()"
    />
  </div>
</div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { onMounted, reactive, computed } from 'vue'
import { appUtil, dateTimeUtil, requestUtil } from '@/utils'
import {
  useAppDialog,
  useAppGlobalProperties,
  useAppToast,
  useDynamicDialog
} from '@/modules/common/composables'
import {
  useActividadStore,
  useMantenedorStore,
  usePamStore
} from '@/modules/global/composables'
import {
  useCausaAsignacionStore,
  useFlujoPamAsignacion,
  useLoadingStates
} from '@/modules/asignacion/composables'
import TablaDiligenciasInstruidas from '@/modules/global/components/diligencias/TablaDiligenciasInstruidas.vue'
import TablaDiligenciasSugeridas from '@/modules/global/components/diligencias/TablaDiligenciasSugeridas.vue'
import ModalInstruirDiligencia from '@/modules/global/components/diligencias/ModalInstruirDiligencia.vue'
import ModalVerDocumento from '@/modules/global/components/documentos/ModalVerDocumento.vue'

const { toastSuccess } = useAppToast()

const { launchDialog } = useAppDialog()
const { launchDynamicDialog } = useDynamicDialog()

const { $userName, $userFiscaliaActual } = useAppGlobalProperties()

const { procesoPam } = usePamStore()

const {
  ruc,
  causaActual,
  idDenuncia,
  causaAsignacion_completarSolicitarAntecedentes
} = useCausaAsignacionStore()

const { flujoAsignacion } = useFlujoPamAsignacion()

const {
  actividades,
  paginacionActividades,
  diligenciasSugeridas,
  paginacionDiligenciasSugeridas,
  actividad_getActividades,
  actividad_enviarSolicitud,
  actividad_getDiligenciasSugeridas
} = useActividadStore()

const { loadingStates } = useLoadingStates()

const {
  tipoActividadByCodigo,
  procesoHito,
  tipoOrigen,
  mantenedor_getInstituciones,
  mantenedor_getTipoActividadByCodigoActividad,
  mantenedor_getNombreInstitucion,
  mantenedor_getNombreSubtipoActividadById,
  mantenedor_getNombreSubSubtipoActividadById,
  mantenedor_getEstadoMedidaHito,
  mantenedor_getSubtiposActividadList,
  mantenedor_getSubSubtiposActividadList,
  mantenedor_getProcesoHito,
  mantenedor_getTipoOrigenActividad
} = useMantenedorStore()

const isLoading = reactive({
  instruirDiligencia: false,
  diligenciasInstruidas: false,
  diligenciasSugeridas: false,
  tipoOrigenActividad: false,
  procesoHito: false,
  tipoActividadByCodigo: false
})

const diligencias = reactive({
  instruidasFirst: 0,
  sugeridasFirst: 0
})

const isSomethingLoading = computed(() => {
  const isLoadingValues = Object.values(isLoading)

  return (
    isLoadingValues.some((loading) => loading) ||
    loadingStates.completarSolicitudAntecedentes
  )
})

const tipoOrigenCausa = computed(() => {
  const origenCausa = tipoOrigen.value?.find((origen) => origen.codigo === '1') // CODIGO 1: ORIGEN CAUSA
  return origenCausa
})

function getDiligenciasInstruidas (pagination = undefined) {
  const { idCausa } = causaActual.value?.causa
  if (!idCausa) return

  if (!pagination) {
    diligencias.instruidasFirst = 0
  }

  requestUtil({
    action: actividad_getActividades,
    payload: {
      params: {
        'id-origen-actividad': idCausa,
        'cod-tipo-actividad': '26', // CODIGO 26: DILIGENCIAS
        'cod-estados': '1,7,3,8', // 1: EN_PREPARACION, 7: INGRESADA, 3: APROBADA, 8: CUMPLIDA
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    loader: (l) => {
      isLoading.diligenciasInstruidas = l
    }
  })
}

function openModalInstruirDiligencia (diligencia = undefined) {
  const { idCausa } = causaActual.value?.causa

  launchDynamicDialog({
    component: ModalInstruirDiligencia,
    header: 'Instruir Nueva Diligencia',
    width: '90%',
    data: {
      ruc: ruc.value,
      isSugerida: !!diligencia,
      idCausa: idCausa,
      idDenuncia: idDenuncia.value,
      proceso: procesoHito.value[0],
      idTipoActividad: tipoActividadByCodigo.value?.id,
      idTipoOrigenActividad: tipoOrigenCausa.value?.id,
      descripcionSubtipoActividad: diligencia?.tipoDiligencia,
      idSubtipoActividad: diligencia?.idTipoDiligencia,
      descripcionSubSubtipoActividad: diligencia?.subTipoDiligencia,
      idSubSubtipoActividad: diligencia?.idSubTipoDiligencia
    },
    onClose: ({ data }) => {
      if (data) {
        instruirNuevaDiligencia(data)
      }
    }
  })
}

function instruirNuevaDiligencia (data) {
  requestUtil({
    action: actividad_enviarSolicitud,
    payload: {
      solicitud: data
    },
    loader: (l) => {
      isLoading.instruirDiligencia = l
    },
    resolve: (diligencia) => {
      const solicitud = {
        id: diligencia?.idActividad,
        fechaHoraSolicitud: dateTimeUtil.formatToBackendWithTime(),
        idInstitucionEjecutora: diligencia?.idUnidadEjecutora,
        idResponsableMaterializar: null,
        nombre: $userName.value, // nombre usuario
        nombreInstitucionEjecutora: nombreInstitucion(diligencia?.idUnidadEjecutora),
        nombreResponsableMaterializar: data?.seDerivaEquipoJuridico ? 'Equipo Juridico' : 'Fiscal',
        plazo: diligencia?.plazoDias,
        plazoAutomaticoDias: parseInt(diligencia?.plazoDias),
        plazoDias: parseInt(diligencia?.plazoDias),
        plazoSolicitud: fechaPlazo(diligencia?.fechaSolicitud, diligencia?.plazoDias),
        primerVencimiento: true,
        requiereApoyo: true,
        resolucion: '',
        materializarSolicitud: diligencia?.seDerivaEquipoJuridico,
        revisarSolicitud: diligencia?.seRevisaEscrito,
        subTipo: subtipoDiligencia(diligencia?.idSubSubtipoActividad),
        tipo: diligencia?.idTipoActividad,
        tipoDiligencia: tipoDiligencia(diligencia?.idSubtipoActividad)
      }

      completarSolicitudAntecedentes(solicitud)
      appUtil.scrollTo('#diligencias-instruidas')
      getDiligenciasInstruidas()
    }
  })
}

function completarSolicitudAntecedentes (data) {
  requestUtil({
    action: causaAsignacion_completarSolicitarAntecedentes,
    payload: {
      idInstanciaTarea: procesoPam.value?.taskId,
      solicitud: data
    },
    loader: (l) => {
      loadingStates.completarSolicitudAntecedentes = l
    },
    resolve: (data) => {
      toastSuccess('¡Diligencia Instruida con Éxito!')
      flujoAsignacion.revisaObtiene = true
    }
  })
}

function openModalVerDocumento (idDocumentoSolicitud) {
  launchDynamicDialog({
    component: ModalVerDocumento,
    header: 'Cargando Documento Solicitud...',
    data: {
      idDocumentoSolicitud: idDocumentoSolicitud
    }
  })
}

function getDiligenciasSugeridas (pagination = undefined) {
  if (!pagination) {
    diligencias.instruidasFirst = 0
  }

  requestUtil({
    action: actividad_getDiligenciasSugeridas,
    payload: {
      params: {
        'id-denuncia': idDenuncia.value,
        'cod-region': $userFiscaliaActual.value.region,
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    loader: (l) => {
      isLoading.diligenciasSugeridas = l
    }
  })
}

function nombreInstitucion (idInstitucionEjecutora) {
  return mantenedor_getNombreInstitucion(idInstitucionEjecutora?.toUpperCase())
}

function fechaPlazo (fechaSolicitud, plazoString) {
  const plazo = parseInt(plazoString) || 0
  return dateTimeUtil.addDays(fechaSolicitud, plazo)
}

function tipoDiligencia (idSubtipo) {
  return mantenedor_getNombreSubtipoActividadById(idSubtipo?.toUpperCase())
}

function subtipoDiligencia (idSubSubtipo) {
  return mantenedor_getNombreSubSubtipoActividadById(idSubSubtipo?.toUpperCase())
}

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getInstituciones })
  requestUtil({ action: mantenedor_getEstadoMedidaHito })
  requestUtil({ action: mantenedor_getSubtiposActividadList })
  requestUtil({ action: mantenedor_getSubSubtiposActividadList })

  requestUtil({
    action: mantenedor_getTipoOrigenActividad,
    loader: (l) => {
      isLoading.tipoOrigenActividad = l
    }
  })
  requestUtil({
    action: mantenedor_getProcesoHito,
    payload: { codigo: 5 }, // CODIGO 5: Proceso Asignacion
    loader: (l) => {
      isLoading.procesoHito = l
    }
  })
  requestUtil({
    action: mantenedor_getTipoActividadByCodigoActividad,
    payload: {
      params: { codigo: 26 } // CODIGO 26: DILIGENCIAS
    },
    loader: (l) => {
      isLoading.tipoActividadByCodigo = l
    }
  })
}

onMounted(() => {
  getDataMantenedor()
  getDiligenciasInstruidas()
  getDiligenciasSugeridas()
})
</script>
