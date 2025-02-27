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
    legend="Diligencias Sugeridas"
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
      class=""
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
import { computed, onMounted, reactive } from 'vue'
import { appUtil, dateTimeUtil, requestUtil } from '@/utils'
import { useAppGlobalProperties, useAppToast, useDynamicDialog } from '@/modules/common/composables'
import { useActividadStore, useMantenedorStore, usePamStore } from '@/modules/global/composables'
import { useCausaPreclasificadorStore, useFlujoPamPreclasificador, useLoadingStates } from '@/modules/preclasificador/composables'
import TablaDiligenciasInstruidas from '@/modules/global/components/diligencias/TablaDiligenciasInstruidas.vue'
import TablaDiligenciasSugeridas from '@/modules/global/components/diligencias/TablaDiligenciasSugeridas.vue'
import ModalInstruirDiligencia from '@/modules/global/components/diligencias/ModalInstruirDiligencia.vue'
import ModalVerDocumento from '@/modules/global/components/documentos/ModalVerDocumento.vue'

const { toastSuccess } = useAppToast()
const { launchDynamicDialog } = useDynamicDialog()

const { loadingState } = useLoadingStates()

const { $userName, $userFiscaliaActual } = useAppGlobalProperties()

const {
  ruc,
  causaActual,
  idDenuncia,
  causaPreclasificador_solicitarAntecedentesPAM,
  causaPreclasificador_iniciarYReservar
} = useCausaPreclasificadorStore()

const {
  actividades,
  paginacionActividades,
  diligenciasSugeridas,
  paginacionDiligenciasSugeridas,
  actividad_enviarSolicitud,
  actividad_getActividades,
  actividad_getDiligenciasSugeridas
} = useActividadStore()

const { procesoPam } = usePamStore()

const {
  tipoActividadByCodigo,
  procesoHito,
  tipoOrigen,
  mantenedor_getInstituciones,
  mantenedor_getEstadoMedidaHito,
  mantenedor_getPlazosDiligencia,
  mantenedor_getSubtiposActividadList,
  mantenedor_getSubSubtiposActividadList,
  mantenedor_getTipoActividadByCodigoActividad,
  mantenedor_getNombreInstitucion,
  mantenedor_getProcesoHito,
  mantenedor_getTipoOrigenActividad,
  mantenedor_getNombreSubtipoActividadById,
  mantenedor_getNombreSubSubtipoActividadById
} = useMantenedorStore()

const { flujoPreclasificador } = useFlujoPamPreclasificador()

const isLoading = reactive({
  instruirDiligencia: false,
  diligenciasInstruidas: false,
  diligenciasSugeridas: false,
  tipoOrigenActividad: false,
  tipoActividadByCodigo: false,
  procesoHito: false
})

const diligencias = reactive({
  instruidasFirst: 0,
  sugeridasFirst: 0
})

const isSomethingLoading = computed(() => {
  const isLoadingValues = Object.values(isLoading)

  return isLoadingValues.some(loading => loading) ||
         loadingState.iniciarYReservar ||
         loadingState.completarSolicitudAntecedentes
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
    resolve: (da) => {
      console.log('getDiligencias', da)
    },
    reject: (e) => {
      console.error(e)
    },
    loader: (l) => { isLoading.diligenciasInstruidas = l }
  })
}

function completarSolicitudAntecedentes (data) {
  requestUtil({
    action: causaPreclasificador_solicitarAntecedentesPAM,
    payload: {
      taskId: procesoPam.value?.taskId,
      solicitud: data
    },
    loader: (l) => { loadingState.completarSolicitudAntecedentes = l },
    resolve: ({ taskInstanceId }) => {
      flujoPreclasificador.obtieneAntecedentesEsp = true
      iniciarYReservar(taskInstanceId)
    }
  })
}

function iniciarYReservar (taskInstanceId) {
  requestUtil({
    action: causaPreclasificador_iniciarYReservar,
    payload: { taskId: taskInstanceId },
    loader: (l) => { loadingState.iniciarYReservar = l },
    resolve: () => toastSuccess('¡Diligencia Instruida con Éxito!')
  })
}

function openModalInstruirDiligencia (diligencia = undefined) {
  const { idCausa } = causaActual.value?.causa

  launchDynamicDialog({
    component: ModalInstruirDiligencia,
    header: `Nueva Diligencia RUC: ${ruc.value}`,
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
    loader: (l) => { isLoading.instruirDiligencia = l },
    resolve: (diligencia) => {
      const solicitud = {
        id: diligencia?.idActividad,
        delitos: [],
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
      getDiligenciasInstruidas()

      appUtil.scrollTo('#diligencias-instruidas')
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
  requestUtil({ action: mantenedor_getPlazosDiligencia })
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
    payload: { codigo: 4 }, // CODIGO 4: Proceso Preclasificación
    loader: (l) => { isLoading.procesoHito = l }
  })
  requestUtil({
    action: mantenedor_getTipoActividadByCodigoActividad,
    payload: {
      params: { codigo: 26 } // CODIGO 26: DILIGENCIAS
    },
    loader: (l) => { isLoading.tipoActividadByCodigo = l }
  })
}

onMounted(() => {
  getDataMantenedor()
  getDiligenciasInstruidas()
  getDiligenciasSugeridas()
})

</script>
