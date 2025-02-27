<template>
<section class="col-12 p-0">
  <h2 class="mt-0 mb-4 p-2">
    Transferir Causa
  </h2>
  <AppFieldset
    v-if="hasPropuestaAsignacion"
    class="w-full"
    legend="Propuesta del Preclasificador"
  >
    <PropuestaPreclasificador :propuesta="preclasificacion" />
  </AppFieldset>
  <AppFieldset legend="Datos para Transferir Causa">
    <AppForm
      id="form-transferir-causa"
      class="grid pt-4"
      :form-submitted="formSubmitted"
      validation-scope="form-transferir-causa"
    >
      <div class="col-12 mb-5">
        <TablaResultadoGeorreferencia
          v-model:selection="fiscaliaCompetenteSelected"
          :loading="isSomethingLoading"
          no-paginator
          :value="fiscaliasCompetentes"
        />
      </div>
      <div class="col-12 lg:col-6 grid">
        <AppDropdown
          id="motivo-transferencia"
          v-model="formData.motivoTransferencia"
          class="col-12 mb-4"
          label="Motivo de Transferencia"
          option-label="descripcion"
          option-value="id"
          :options="motivoTransferencia"
          placeholder
          :retrieve-data-action="mantenedor_getMotivosTransferencia"
          :rules="{ required }"
          show-clear
        />
        <AppDropdown
          id="fiscalia-competente"
          v-model="formData.fiscaliaCompetente"
          class="col-12"
          label="Fiscalía Competente"
          option-label="descripcion"
          option-value="id"
          :options="fiscalias"
          placeholder
          :retrieve-data-action="mantenedor_getFiscalias"
          :rules="{ required }"
          show-clear
        />
      </div>
      <AppTextarea
        id="comentario"
        v-model="formData.comentario"
        class="col-12 lg:col-6"
        cols="150"
        label="Comentario"
        rows="6"
        :rules="{ required }"
      />
    </AppForm>
  </AppFieldset>
  <AppFieldset
    class="p-fluid"
    disabled
    legend="Proponer Destino de la Especie"
  >
    <TablaEspeciesFlujoPreclasificador
      :value="especies"
      @proponer-destino-especie="proponerDestinoEspecie"
    />
  </AppFieldset>

  <AppFieldset
    legend="Revisar Diligencias Prioritarias"
    :toggleable="true"
  >
    <TablaDiligenciasInstruidas
      id="diligencias-instruidas"
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
      :loading="isLoading.diligenciasSugeridas"
      :value="diligenciasSugeridas.slice(0,9)"
      @instruir="openModalInstruirDiligencia"
    />
  </AppFieldset>
  <div
    class="col-3 mb-4"
  >
    <Button
      icon="pi pi-external-link"
      icon-pos="right"
      label="Instruir Nueva Diligencia"
      :loading="isSomethingLoading"
      @click="openModalInstruirDiligencia()"
    />
  </div>

  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-send"
    icon-pos="right"
    label="Generar y Despachar Notificación de Transferencia"
    :loading="isSomethingLoading"
    @click="handleConfirmarTransferencia"
  />
</section>
</template>

<script setup>
import { reactive, onMounted, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { appUtil, requestUtil } from '@/utils'
import {
  useAppDialog,
  useAppGlobalProperties,
  useAppToast,
  useDynamicDialog,
  useFormValidation
} from '@/modules/common/composables'
import {
  useActividadStore,
  useEspeciesDineroStore,
  useGeorreferenciaStore,
  useMantenedorStore,
  usePamStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'
import { useCausaAsignacionStore } from '@/modules/asignacion/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaEspeciesFlujoPreclasificador from '@/modules/global/components/especies-dinero/TablaEspeciesFlujoPreclasificador.vue'
import TablaDiligenciasInstruidas from '@/modules/global/components/diligencias/TablaDiligenciasInstruidas.vue'
import ModalInstruirDiligencia from '@/modules/global/components/diligencias/ModalInstruirDiligencia.vue'
import TablaDiligenciasSugeridas from '@/modules/global/components/diligencias/TablaDiligenciasSugeridas.vue'
import ModalProponerDestinoEspecie from '@/modules/preclasificador/components/modals/ModalProponerDestinoEspecie.vue'
import TablaResultadoGeorreferencia from '@/modules/global/components/competencia-territorial/TablaResultadoGeorreferencia.vue'
import PropuestaPreclasificador from '@/modules/asignacion/components/propuesta-asignacion/PropuestaPreclasificador.vue'
import ModalNotificacionTransferencias from '@/modules/asignacion/components/modals/ModalNotificacionTransferencias.vue'
import ModalVerDocumento from '@/modules/global/components/documentos/ModalVerDocumento.vue'

const router = useRouter()

const { launchDialog } = useAppDialog()
const { launchDynamicDialog } = useDynamicDialog()

const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()

const { $userFiscaliaActual } = useAppGlobalProperties()

const {
  ruc,
  idDenuncia,
  preclasificacion,
  causaActual,
  hasPropuestaAsignacion,
  causaAsignacion_completarTransferirCausa,
  causaAsignacion_completarInstruirDiligencias
} = useCausaAsignacionStore()

const {
  especies,
  especiesDinero_getEspecieByIdDenuncia,
  especiesDinero_proponerDestinoEspecieEnCausa
} = useEspeciesDineroStore()

const {
  paginacion,
  sujetosIntervinientes_getSujetosByIdGlobal
} = useSujetosIntervinientesStore()

const { fiscaliasCompetentes } = useGeorreferenciaStore()

const {
  actividades,
  paginacionActividades,
  actividad_enviarSolicitud,
  actividad_getActividades
} = useActividadStore()

const {
  motivoTransferencia,
  fiscalias,
  tipoActividadByCodigo,
  procesoHito,
  tipoOrigen,
  mantenedor_getTipoActividadByCodigoActividad,
  mantenedor_getEstadoMedidaHito,
  mantenedor_getTipoOrigenActividad,
  mantenedor_getProcesoHito,
  mantenedor_getFamiliaEspecies,
  mantenedor_getTiposEspecies,
  mantenedor_getAmbitoEspecie,
  mantenedor_getInstituciones,
  mantenedor_getMotivosTransferencia,
  mantenedor_getFiscalias,
  mantenedor_getCodigoMotivoTransferenciaById
} = useMantenedorStore()

const { procesoPam } = usePamStore()

const formData = reactive({
  motivoTransferencia: '',
  fiscaliaCompetente: '',
  comentario: '',
  indicadorEvidencia: null,
  instruyeDiligencias: false
})

const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'form-transferir-causa'
})

const isLoading = reactive({
  instruirDiligencia: false,
  diligenciasInstruidas: false,
  diligenciasSugeridas: false,
  getIdFiscaliaActual: false,
  completarSolicitudAntecedentes: false,
  tipoOrigenActividad: false,
  procesoHito: false,
  tipoActividadByCodigo: false,
  transferirCausa: false
})

const isSomethingLoading = computed(() => {
  const isLoadingValues = Object.values(isLoading)

  return isLoadingValues.some(loading => loading)
})

const diligenciasSugeridas = ref([])
const fiscaliaCompetenteSelected = ref(null)
const diligenciasInstruidasFirst = ref(0)

const nroIntervinientes = computed(() => paginacion.value?.elementosTotales)

const idFiscaliaOrigen = computed(() => {
  const fiscalia = fiscalias.value.find((f) => f.codigo === $userFiscaliaActual.value?.idFiscalia)

  return fiscalia?.id
})

const nombreFiscaliaDestino = computed(() => {
  const fiscalia = fiscalias.value.find((f) => f.id === formData.fiscaliaCompetente)
  return fiscalia?.descripcion
})

const codigoTransferencia = computed(() => mantenedor_getCodigoMotivoTransferenciaById(formData.motivoTransferencia))

// eslint-disable-next-line no-unused-vars
const isAltaComplejidad = computed(() => {
  return codigoTransferencia.value === '4' // Código FIAC (Fiscalía Alta Complejidad)
})

const tipoOrigenCausa = computed(() => {
  const origenCausa = tipoOrigen.value?.find((origen) => origen.codigo === '1') // CODIGO 1: ORIGEN CAUSA
  return origenCausa
})

watch(fiscaliaCompetenteSelected, (fiscaliaCompetente) => {
  const fiscalia = fiscalias.value?.find(f => appUtil.includeWord(f.id, fiscaliaCompetente?.idFiscalia))
  if (!fiscalia) {
    toastError('La fiscalía no se encuentra en el Mantenedor')
    return
  }

  const motivo = motivoTransferencia.value?.find(m => m.codigo === '0') // CODIGO 0: 'Incompetencia Territorial'

  formData.motivoTransferencia = motivo.id
  formData.fiscaliaCompetente = fiscalia?.id
})

function openModalVerDocumento (idDocumentoSolicitud) {
  launchDynamicDialog({
    component: ModalVerDocumento,
    header: 'Cargando Documento Solicitud...',
    data: {
      idDocumentoSolicitud: idDocumentoSolicitud
    }
  })
}

function proponerDestinoEspecie (especie) {
  launchDialog({
    component: ModalProponerDestinoEspecie,
    header: 'Proponer Destino de la Especie',
    width: '65%',
    props: { especie },
    confirmLabel: 'Definir Destino',
    accept: (res) => {
      patchProponerDestinoEspecie(especie, res)
    }
  })
}

function patchProponerDestinoEspecie (especie, proposito) {
  requestUtil({
    action: especiesDinero_proponerDestinoEspecieEnCausa,
    payload: {
      idEspecie: especie?.idEspecie,
      destino: proposito?.destinoEspecie,
      motivo: proposito?.motivo
    },
    resolve: () => getEspecies()
  })
}

function handleConfirmarTransferencia () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  launchDynamicDialog({
    component: ModalNotificacionTransferencias,
    data: {
      motivoTransferencia: formData.motivoTransferencia,
      ruc,
      nroIntervinientes: nroIntervinientes.value,
      fiscaliaDestino: nombreFiscaliaDestino.value
    },
    header: 'Notificación de Transferencia',
    width: '80%',
    onClose: ({ data }) => {
      console.log('ok')
      if (data) {
        transferirCausa()
      }
    }
  })
}

function transferirCausa () {
  requestUtil({
    action: causaAsignacion_completarTransferirCausa,
    payload: {
      idInstanciaTarea: procesoPam.value?.taskId,
      requiereInstruirDiligenciasPrioritarias: formData.instruyeDiligencias,
      body: {
        comentario: formData.comentario,
        idFiscaliaOrgien: idFiscaliaOrigen.value,
        idFiscaliaDestino: formData.fiscaliaCompetente, // CAMBIAR CUANDO SE DEFINA
        idMotivoTransferencia: formData.motivoTransferencia
      }
    },
    loader: (l) => { isLoading.transferirCausa = l },
    resolve: () => {
      toastSuccess('Causa Transferida exitosamente!')
      router.push({ name: 'BandejaAsignacion' })
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
      isSugerida: diligencia ? true : undefined,
      diligenciaSugerida: diligencia || undefined,
      idCausa: idCausa,
      idDenuncia: idDenuncia.value,
      proceso: procesoHito.value[0],
      idTipoActividad: tipoActividadByCodigo.value?.id,
      idTipoOrigenActividad: tipoOrigenCausa.value?.id
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
        idActividad: diligencia?.idActividad,
        idTipo: diligencia?.idTipoActividad,
        idSubTipo: diligencia?.idSubtipoActividad,
        idSubSubTipo: diligencia?.idSubSubtipoActividad,
        idInstitucionEjecutora: diligencia?.idUnidadEjecutora,
        idResponsableMaterializar: diligencia?.idUnidadEjecutora,
        requiereApoyo: true,
        materializarSolicitud: diligencia?.seDerivaEquipoJuridico,
        revisarSolicitud: diligencia?.seRevisaEscrito,
        plazoDias: parseInt(diligencia?.plazoDias)
      }

      completarInstruirDiligencias(solicitud)
      appUtil.scrollTo('#diligencias-instruidas')
      getDiligenciasInstruidas()
    }
  })
}

function completarInstruirDiligencias (solicitud) {
  requestUtil({
    action: causaAsignacion_completarInstruirDiligencias,
    payload: {
      solicitud: solicitud,
      idInstanciaTarea: procesoPam.value?.taskId
    },
    loader: (l) => { isLoading.completarSolicitudAntecedentes = l },
    resolve: () => {
      toastSuccess('¡Diligencia Instruida con Éxito!')
      formData.instruyeDiligencias = true
    }
  })
}

function setPropuestaCausa () {
  const { transferir } = preclasificacion.value
  formData.comentario = transferir?.comentario
  formData.motivoTransferencia = transferir?.idMotivoTransferencia
}

function getEspecies () {
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value }
  })
}

function getDiligenciasInstruidas (pagination = undefined) {
  const { idCausa } = causaActual.value?.causa
  if (!idCausa) return

  if (!pagination) {
    diligenciasInstruidasFirst.value = 0
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
    loader: (l) => { isLoading.diligenciasInstruidas = l }
  })
}

function getSujetos () {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: { idDenuncia: idDenuncia.value }
  })
}

async function getDataMantenedor () {
  requestUtil({ action: mantenedor_getFamiliaEspecies })
  requestUtil({ action: mantenedor_getTiposEspecies })
  requestUtil({ action: mantenedor_getAmbitoEspecie })
  requestUtil({ action: mantenedor_getInstituciones })
  requestUtil({ action: mantenedor_getEstadoMedidaHito })

  requestUtil({
    action: mantenedor_getTipoOrigenActividad,
    loader: (l) => { isLoading.tipoOrigenActividad = l }
  })
  requestUtil({
    action: mantenedor_getProcesoHito,
    payload: { codigo: 5 }, // CODIGO 5: Proceso Asignacion
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
  getEspecies()
  getDataMantenedor()
  setPropuestaCausa()
  getSujetos()
  getDiligenciasInstruidas()
})

</script>
