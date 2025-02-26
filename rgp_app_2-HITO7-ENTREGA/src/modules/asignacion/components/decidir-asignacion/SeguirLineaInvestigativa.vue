<template>
<section class="col-12 p-0 grid">
  <h2 class="mt-0 mb-4 p-2">
    Seguir Línea Investigativa
  </h2>
  <AppFieldset
    v-if="hasPropuestaAsignacion"
    class="w-full"
    legend="Propuesta del Preclasificador"
    :toggleable="true"
  >
    <PropuestaPreclasificador :propuesta="preclasificacion" />
  </AppFieldset>
  <AppFieldset legend="Datos para Seguir Línea Investigativa">
    <AppForm
      id="seguir-linea-investigativa"
      class="grid"
      :form-submitted="formSubmitted"
      validation-scope="form-seguir-linea-investigativa"
    >
      <AppDropdown
        id="complejidad"
        v-model="formData.complejidad"
        class="col-12 lg:col-3 p-fluid"
        label="Complejidad"
        option-label="descripcion"
        option-value="codigoPam"
        :options="complejidadPamOptions"
        placeholder
        :retrieve-data-action="mantenedor_getTiposComplejidad"
        :rules="{ required }"
        show-clear
        @change="getEscritoConsultaFR"
      />
      <AppDropdown
        id="especialidad"
        v-model="formData.especialidad"
        class="col-12 lg:col-3 p-fluid"
        label="Especialidad"
        option-label="descripcion"
        option-value="id"
        :options="especialidadesOptions"
        placeholder
        :retrieve-data-action="mantenedor_getEspecialidadesFiscalia"
        :rules="{ required }"
        show-clear
        @change="getFiscales"
      />
      <AppDropdown
        id="fiscales"
        v-model="formData.fiscal"
        class="col-12 lg:col-3 p-fluid"
        label="Fiscales"
        :loading="isLoading.fiscales"
        option-label="nombresCompletos"
        option-value="funcionarioId"
        :options="fiscales"
        placeholder
        :rules="{ required }"
        show-clear
      />
      <AppTextarea
        id="comentario"
        v-model="formData.comentario"
        class="col-12 p-fluid"
        cols="150"
        label="Motivo de Asignación"
        rows="5"
        :rules="{ required }"
      />
    </AppForm>
  </AppFieldset>

  <AppFieldset
    v-if="isAltaComplejidad"
    class="w-full"
    legend="Consulta al Fiscal Regional"
  >
    <ConsultaFiscalRegional
      v-model:consulta="consultaFR"
      :options-tipo-impacto="tiposImpacto"
      @change:impacto="changeImpacto"
    />
  </AppFieldset>

  <div class="col-12 mb-4 grid">
    <h4 class="ml-2 col-12">
      ¿Desea Instruir Diligencias Prioritarias?
    </h4>
    <AppSelectButton
      id="instruye-prioritaria"
      v-model="instruyePrioritaria"
      class="col-12 md:col-4"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false }
      ]"
    />
  </div>

  <AppFieldset
    v-if="instruyePrioritaria"
    legend="Instruir Diligencias Prioritarias"
  >
    <AppFieldset
      class="mt-3 mx-2 w-full"
      legend="Diligencias Realizadas e Instruidas"
      :toggleable="true"
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
      class="mt-3 mx-2 w-full"
      legend="Diligencias Prioritarias Sugeridas"
      :toggleable="true"
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

    <div class="mx-2 mb-3 mt-3 w-full">
      <Button
        icon="pi pi-external-link"
        icon-pos="right"
        label="Instruir Nueva Diligencia"
        :loading="isSomethingLoading"
        @click="openModalInstruirDiligencia()"
      />
    </div>
  </AppFieldset>
  <AppBtnNextTeleported
    class="mr-2"
    :icon="isAltaComplejidad ? 'pi pi-send' : 'pi pi-check-circle'"
    icon-pos="right"
    :label="lblIsAltaComplejidad"
    :loading="isSomethingLoading"
    @click="openModalConfirmarSLI"
  />
</section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { appUtil, dateTimeUtil, requestUtil } from '@/utils'
import { useAppDialog, useAppGlobalProperties, useAppToast, useDynamicDialog, useFormValidation } from '@/modules/common/composables'
import { useActividadStore, useMantenedorStore, usePamStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { useCausaAsignacionStore } from '@/modules/asignacion/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaDiligenciasInstruidas from '@/modules/global/components/diligencias/TablaDiligenciasInstruidas.vue'
import TablaDiligenciasSugeridas from '@/modules/global/components/diligencias/TablaDiligenciasSugeridas.vue'
import ModalInstruirDiligencia from '@/modules/global/components/diligencias/ModalInstruirDiligencia.vue'
import PropuestaPreclasificador from '@/modules/asignacion/components/propuesta-asignacion/PropuestaPreclasificador.vue'
import ConsultaFiscalRegional from '@/modules/asignacion/components/propuesta-asignacion/ConsultaFiscalRegional.vue'
import ModalConfirmacionSeguirLinea from '@/modules/asignacion/components/modals/ModalConfirmacionSeguirLinea.vue'
import ModalVerDocumento from '@/modules/global/components/documentos/ModalVerDocumento.vue'

const { launchDialog } = useAppDialog()
const { launchDynamicDialog } = useDynamicDialog()

const { toastError, toastSuccess, TOAST_MESSAGES } = useAppToast()

const router = useRouter()

const { $userFiscaliaActual } = useAppGlobalProperties()

const {
  actividades,
  paginacionActividades,
  diligenciasSugeridas,
  paginacionDiligenciasSugeridas,
  actividad_enviarSolicitud,
  actividad_getActividades,
  actividad_getDiligenciasSugeridas
} = useActividadStore()

const {
  tiposComplejidad,
  tiposImpacto,
  especialidadesFiscalia,
  fiscales,
  tipoActividadByCodigo,
  procesoHito,
  tipoOrigen,
  mantenedor_getTiposComplejidad,
  mantenedor_getTiposImpacto,
  mantenedor_getEspecialidadesFiscalia,
  mantenedor_getNombreTipoDelito,
  mantenedor_getInstituciones,
  mantenedor_getFiscalesByIdFiscaliaAndIdEspecialidad,
  mantenedor_getFiscalias,
  mantenedor_getTipoActividadByCodigoActividad,
  mantenedor_getEstadoMedidaHito,
  mantenedor_getTipoOrigenActividad,
  mantenedor_getProcesoHito
} = useMantenedorStore()

const {
  ruc,
  idDenuncia,
  causaActual,
  preclasificacion,
  hasPropuestaAsignacion,
  causaAsignacion_completarSeguirLineaInvestigativa,
  causaAsignacion_completarSugerirFRTransferencia,
  causaAsignacion_completarInstruirDiligencias
} = useCausaAsignacionStore()

const { procesoPam } = usePamStore()

const { paginacion, sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()

const consultaFR = ref('')

const isLoading = reactive({
  instruirDiligencia: false,
  diligenciasInstruidas: false,
  diligenciasSugeridas: false,
  getFiscales: false,
  getIdFiscalia: false,
  completarSolicitudAntecedentes: false,
  tipoOrigenActividad: false,
  procesoHito: false,
  tipoActividadByCodigo: false,
  completarSeguirLineaInvestigativa: false,
  completarSugerirTransferenciaFR: false
})

const isSomethingLoading = computed(() => {
  const isLoadingValues = Object.values(isLoading)

  return isLoadingValues.some(loading => loading)
})

const formData = reactive({
  complejidad: '',
  motivoDeAsignacion: '',
  especialidad: '',
  fiscal: '',
  comentario: '',
  indicadorEvidencia: null,
  dataNuevaDiligencia: null,
  impacto: null,
  instruyeDiligencias: false
})

const idFiscalia = ref('')

const diligencias = reactive({
  instruidasFirst: 0,
  sugeridasFirst: 0
})

const nroIntervinientes = computed(() => paginacion.value?.elementosTotales)

const tipoOrigenCausa = computed(() => {
  const origenCausa = tipoOrigen.value?.find((origen) => origen.codigo === '1') // CODIGO 1: ORIGEN CAUSA
  return origenCausa
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-seguir-linea-investigativa'
})

const complejidadPamOptions = computed(() => {
  return tiposComplejidad.value.map((c) => {
    let complex = ''

    if (c.codigo === '1') complex = 'alta'
    if (c.codigo === '2') complex = 'media'
    if (c.codigo === '3') complex = 'baja'

    return {
      ...c,
      codigoPam: complex
    }
  })
})

const isAltaComplejidad = computed(() => {
  return appUtil.includeWord(formData.complejidad, 'alta')
})

const lblIsAltaComplejidad = computed(() => {
  return isAltaComplejidad.value ? 'Enviar Consulta a FR' : 'Aprobar y Seguir Linea Investigativa'
})

const nombreFiscalPropuesto = computed(() => {
  const fiscal = fiscales.value.find((f) => f.funcionarioId === formData.fiscal)
  return fiscal?.nombresCompletos || 'Sin Fiscal Asignado'
})

const instruyePrioritaria = ref(false)

const especialidadesOptions = computed(() => {
  const sinEspecialidad = { id: '-1', descripcion: 'Sin Especialidad' }
  return especialidadesFiscalia.value.concat(sinEspecialidad)
})

// SLI: SEGUIR LINEA INVESTIGATIVA
function openModalConfirmarSLI () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  launchDialog({
    component: ModalConfirmacionSeguirLinea,
    header: lblIsAltaComplejidad.value,
    confirmLabel: lblIsAltaComplejidad.value,
    confirmIcon: 'pi pi-send',
    confirmIconPos: 'right',
    cancelIconPos: 'right',
    width: '70%',
    props: {
      isAltaComplejidad: isAltaComplejidad.value,
      data: {
        ruc: ruc.value,
        numeroIntervinientes: nroIntervinientes.value,
        complejidad: formData.complejidad,
        fiscalPropuesto: nombreFiscalPropuesto.value,
        impacto: formData.impacto,
        consultaFiscal: consultaFR.value
      }
    },
    accept: () => {
      if (isAltaComplejidad.value) {
        completarSeguirLineaInvestigativa({
          resolve: () => completarSugerirTransferenciaFR()
        })
      } else {
        completarSeguirLineaInvestigativa({
          resolve: () => {
            toastSuccess('Exitoso! Se Concluyó Seguir Linea Investigativa')
            setTimeout(() => {
              router.push({ name: 'BandejaAsignacion' })
            }, 200)
          }
        })
      }
    }
  })
}

function completarSeguirLineaInvestigativa ({ resolve }) {
  requestUtil({
    action: causaAsignacion_completarSeguirLineaInvestigativa,
    payload: {
      idInstanciaTarea: procesoPam.value?.taskId,
      requiereInstruirDiligenciasPrioritarias: formData.instruyeDiligencias,
      body: {
        comentario: formData.comentario,
        idComplejidad: formData.complejidad,
        idEspecialidad: formData.especialidad,
        idFiscalAsignado: formData.fiscal
      }
    },
    loader: (value) => { isLoading.completarSeguirLineaInvestigativa = value },
    resolve
  })
}

function completarSugerirTransferenciaFR () {
  requestUtil({
    action: causaAsignacion_completarSugerirFRTransferencia,
    payload: {
      idInstanciaTarea: procesoPam.value?.taskId
    },
    loader: (value) => {
      isLoading.completarSugerirTransferenciaFR = value
    },
    resolve: () => {
      router.push({ name: 'BandejaAsignacion' })
      toastSuccess('Exitoso! Consulta a FR Enviada')
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

function openModalVerDocumento (idDocumentoSolicitud) {
  launchDynamicDialog({
    component: ModalVerDocumento,
    header: 'Cargando Documento Solicitud...',
    data: {
      idDocumentoSolicitud: idDocumentoSolicitud
    }
  })
}

const causa = reactive({
  nombre: '',
  delitos: null,
  fechaHoraCreacion: ''
})

function tipoDelito (value) {
  return mantenedor_getNombreTipoDelito(value) || 'Sin tipo delito'
}

function setPropuestaCausa () {
  const { seguirlinea } = preclasificacion.value
  formData.comentario = seguirlinea?.comentario || null
  formData.especialidad = seguirlinea?.idEspecialidad || null
  formData.fiscal = seguirlinea?.idFiscalAsignado || null
  formData.complejidad = seguirlinea?.idComplejidad || null

  if (formData.especialidad) {
    getFiscales()
  }

  const { causa: dataCausa } = causaActual.value

  causa.nombre = dataCausa?.nombreCausa || 'Sin Definir'
  causa.delitos = dataCausa?.delitos
  causa.fechaHoraCreacion = dateTimeUtil.formatToFrontendWithTime(procesoPam.value?.taskCreatedOnDate)

  getEscritoConsultaFR()
}

function getEscritoConsultaFR () {
  if (isAltaComplejidad.value) {
    consultaFR.value = appUtil.getEscritoConsultaFR({
      ruc: ruc.value,
      causa: causa,
      propuestaPreclasificador: propuestaPreclasificador(preclasificacion.value?.decisionAsignacion),
      tipoDelito: tipoDelito
    })
    return
  }
  consultaFR.value = ''
}

function changeImpacto (value) {
  getEscritoConsultaFR()
  if (value) {
    formData.impacto = value
    consultaFR.value += `<p><strong>Impacto: </strong>${value}</p>`
  }
}

function getSujetos () {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: idDenuncia.value
    }
  })
}

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
    loader: (l) => { isLoading.diligenciasInstruidas = l }
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

function getFiscales () {
  requestUtil({
    action: mantenedor_getFiscalesByIdFiscaliaAndIdEspecialidad,
    payload: {
      idFiscalia: idFiscalia.value,
      idEspecialidad: formData.especialidad
    },
    loader: (l) => { isLoading.getFiscales = l }
  })
}

async function getIdFiscalia () {
  await requestUtil({
    action: mantenedor_getFiscalias,
    payload: {
      params: {
        codigo: $userFiscaliaActual.value?.fiscalia // CODIGO FISCALIA
      }
    },
    loader: (l) => { isLoading.getIdFiscalia = l },
    resolve: (data) => {
      idFiscalia.value = data?.[0].id
    }
  })
}

async function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposImpacto })
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

function propuestaPreclasificador (value) {
  switch (value) {
    case 'clasificacion':
      return 'Seguir Linea Investigativa'
    case 'desestimacion':
      return 'Desestimar Causa'
    case 'transferencia':
      return 'Transferir Causa'
    case 'agrupacion':
      return 'Agrupar Causas'
    default:
      return 'Sin Definir'
  }
}

// SE TIENE QUE LLAMAR EN EL ONCREATED PARA QUE PINTE EL FISCAL
await getIdFiscalia()

onMounted(() => {
  getDataMantenedor()
  getDiligenciasInstruidas()
  getDiligenciasSugeridas()
  getSujetos()
  setPropuestaCausa()
})
</script>
