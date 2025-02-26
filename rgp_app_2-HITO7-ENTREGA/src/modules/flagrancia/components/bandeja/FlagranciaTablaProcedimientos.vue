<template>
<section>
  <AppDataTable
    id="dataTableProcedimientos"
    ref="dt"
    v-bind="$attrs"
    v-model:filters="buscarProcedimientosAbiertos"
    class="mt-5"
    filter-display="menu"
    :global-filter-fields="['estado', 'folio', 'delito', 'fechaCreacion', 'fechaActualizacion']"
    :loading="isLoadingTable"
    responsive-layout="scroll"
  >
    <Column header="Ver más">
      <template #body="{ data }">
        <Button
          class="btn-primary p-button-rounded"
          icon="pi pi-plus-circle"
          @click="handleVerMasInfoProcedimiento(data.data.procedimiento)"
        />
      </template>
    </Column>
    <Column
      field="data.procedimiento.idFolio"
      filter-field="folio"
      header="Folio"
      sortable
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline"
          :label="data.data.procedimiento.idFolio ? data.data.procedimiento.idFolio.toString() : 'Sin Folio'"
          @click="sendToStep(data)"
        />
      </template>
    </Column>
    <Column
      field="data.procedimiento.codEstadoFolio"
      filter-field="estado"
      header="Estado"
      sortable
    >
      <template #body="{ data }">
        {{ data.data.procedimiento.codEstadoFolio === '2' ? 'Cerrado' : 'Abierto' }}
      </template>
    </Column>
    <Column
      field="data.procedimiento.alerta"
      filter-field="alerta"
      header="Alerta"
      sortable
    >
      <template #body="{ data }">
        {{ data.data.procedimiento.alerta ?? 'N/A' }}
      </template>
    </Column>
    <Column
      field="data.procedimiento.esDirectaFlagrante"
      filter-field="directaFlagrante"
      header="D. Directa Flagrante"
    >
      <template #body="{ data }">
        {{ formatBolean(data?.data?.procedimiento?.esDirectaFlagrante) }}
      </template>
    </Column>
    <Column
      field="data.procedimiento.delitos"
      filter-field="delito"
      header="Delito"
      sortable
    >
      <template #body="{ data }">
        <div v-if="data?.data?.procedimiento?.delitos">
          <p>
            {{ getNombreTipoDelitoById(data.data?.procedimiento?.delitos[0]?.tipoDelito) }}
          </p>
        </div>
        <div v-else>
          <p>
            {{ 'N/A' }}
          </p>
        </div>
      </template>
    </Column>
    <Column
      field="clasificacionProcedimiento"
      filter-field="clasificacionProcedimiento"
      header="Clasificación del Procedimiento"
      sortable
    >
      <template #body>
        {{ 'Flagrancia / ODA' }}
      </template>
    </Column>
    <Column
      field="tarea.taskCreatedOnDate"
      filter-field="fechaActualizacion"
      header="Fecha Ult. Act."
      sortable
    >
      <template #body="{ data }">
        {{ formatFecha(data.tarea.taskCreatedOnDate) }}
      </template>
    </Column>
    <Column header="Iniciar chat">
      <template #body="{ data }">
        <Button
          class="p-button-rounded p-button-outlined btn-primary-outline"
          icon="pi pi-comments"
          @click="handleInitChat(data)"
        />
      </template>
    </Column>
    <Column header="Instrucción ">
      <template #body="{ data }">
        <Button
          class="p-button-rounded p-button-outlined btn-primary-outline"
          icon="pi pi-external-link"
          @click="sendToStep(data, true)"
        />
      </template>
    </Column>
    <Column
      field="data.procedimiento.fechaIngreso"
      filter-field="fechaCreacion"
      header="Fecha Ingreso Folio"
      sortable
    >
      <template #body="{ data }">
        {{ formatFecha(data.data.procedimiento.fechaIngreso) ?? 'N/A' }}
      </template>
    </Column>
    <Column
      field="data.procedimiento.nombreReponsable"
      filter-field="fiscalTurno"
      header="Fiscal/Turno"
      sortable
    >
      <template #body="{ data }">
        <p v-if="data.data.procedimiento.nombreReponsable">
          {{ data.data.procedimiento.nombreReponsable.toUpperCase() }}
        </p>
        <p v-else>
          Por Asignar
        </p>
      </template>
    </Column>
    <Column
      class="text-center"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="menuOptionSelected"
          :menu-options="opcionesProcedimientos"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { computed, ref, defineProps, watch, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { FilterMatchMode, FilterOperator } from 'primevue/api'

import ModalMasInfoFolio from '@/modules/flagrancia/components/bandeja/modals/ModalMasInfoFolio.vue'
// import ModalSolicitudCerrarFolio from '@/modules/flagrancia/components/bandeja/modals/ModalSolicitudCerrarFolio.vue'
import ModalReAbrirFolio from '@/modules/flagrancia/components/bandeja/modals/ModalReAbrirFolio.vue'
import ModalSolicitudReAbrirFolio from '@/modules/flagrancia/components/bandeja/modals/ModalSolicitudReAbrirFolio.vue'
import ModalResponderSolicitudReAbrirFolio from '@/modules/flagrancia/components/bandeja/modals/ModalResponderSolicitudReAbrirFolio.vue'
import ChatComponent from '@/modules/common/components/ChatComponent.vue'

import { useAppDialog, useAppToast, useAppGlobalProperties } from '@/modules/common/composables'

import { useDelitoStore, useMantenedorStore, useDocumentoStore, useEspeciesDineroStore, usePamStore, useRelacionesStore, useRelatoStore, useSujetosIntervinientesStore, useActividadStore } from '@/modules/global/composables'

import { useStepDetenidosACDStore, useStepRegistroContactoStore, useProcedimientosBandejaStore, useStepDiligenciaStore } from '@/modules/flagrancia/composables'

import { dateTimeUtil, requestUtil } from '@/utils'
// import { CONSTANS } from '@/config'
import { useSessionStore } from '@/modules/session/composables'

const router = useRouter()
const { user, perfiles } = useSessionStore()
const { $hasSomeRoles, $userFiscaliaActual } = useAppGlobalProperties()
const fiscalTurno = computed(() => perfiles.value[6].fiscal_turno)
const policiaTurno = computed(() => perfiles.value[5].fiscal_turno)

const { stepRegistroContacto_SET_DEFAULT_STATE } = useStepRegistroContactoStore()
const { sujetosIntervinientes_SET_DEFAULT_STATE } = useSujetosIntervinientesStore()
const { delito_SET_DEFAULT_STATE } = useDelitoStore()
const { relaciones_SET_DEFAULT_STATE } = useRelacionesStore()
const { especiesDinero_SET_DEFAULT_STATE } = useEspeciesDineroStore()
const { relato_SET_DEFAULT_STATE } = useRelatoStore()
const { documento_SET_DEFAULT_STATE } = useDocumentoStore()
const { actividad_RESET_ACTIVIDADES } = useActividadStore()
const { stepDiligencia_SET_DEFAULT_STATE } = useStepDiligenciaStore()
const { stepDetenidosACD_SET_DEFAULT_STATE } = useStepDetenidosACDStore()

const { pam_SET_PROCESO } = usePamStore()
const { stepRegistroContacto_SET_FOLIO, stepRegistroContacto_getRegistroContacto, unidadPolicialId } = useStepRegistroContactoStore()
const { tieneFolio, procedimientosBandeja_ES_NUEVA_ATENCION_FISCAL_SET_DEFAULT_STATE } = useProcedimientosBandejaStore()
const { mantenedor_getNombreTipoDelito, mantenedor_getNombreInstitucionesDenunciaById, mantenedor_getInstitucionesDenuncia } = useMantenedorStore()

const { launchDialog } = useAppDialog()
const { toastSuccess } = useAppToast()
const {
  // folioProcedimientoData,
  procedimientosBandeja_postReAbrirFolio,
  procedimientosBandeja_postResponderSolicitudReAbrirFolio,
  procedimientosBandeja_SET_FOLIO_PROCEDIMIENTO_DATA,
  procedimientosBandeja_SET_TIENE_FOLIO,
  procedimientosBandeja_SET_ESFLAGRANTE,
  procedimientosBandeja_RESET_FOLIO_PROCEDIMIENTO_DATA,
  procedimientosBandeja_SET_ESTADO_FOLIO,
  procedimientosBandeja_ES_NUEVA_ATENCION_FISCAL
} = useProcedimientosBandejaStore()

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      fechaDesde: '',
      fechaHasta: '',
      texto: ''
    })
  },
  tipoPanelProcedimientos: {
    type: String,
    required: true
  },
  isLoadingTable: Boolean
})

/**
 * traduce el nombre del estado
 */

const emit = defineEmits(['update:modelValue', 'update:isLoadingTable', 'tabla-procedimientos:filtrar-por-rango-fecha', 'tabla-procedimientos:reset-lista', 'get-data'])

function getNombreTipoDelitoById (id) {
  return mantenedor_getNombreTipoDelito(id)
}

function formatFecha (fecha) {
  if (fecha) {
    return dateTimeUtil.formatToFrontendWithTime(fecha)
  }
}

function formatBolean (esDirectaFlagrante) {
  return esDirectaFlagrante === true ? 'SI' : 'NO'
}

// Filtro por rango de fecha
const fechaDesde = ref(null)
const fechaHasta = ref(null)

function handleFiltrarPorRangoFecha (Desde, Hasta) {
  emit('tabla-procedimientos:filtrar-por-rango-fecha', {
    Desde,
    Hasta
  })
}

watch(
  () => fechaDesde.value,
  (currentValue) => {
    handleFiltrarPorRangoFecha(currentValue, fechaHasta.value)
  }
)

watch(
  () => fechaHasta.value,
  (currentValue) => {
    handleFiltrarPorRangoFecha(fechaDesde.value, currentValue)
  }
)

// Barra de busqueda
const buscarProcedimientosAbiertos = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },

  estado: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  },
  folio: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  },
  delito: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  },
  fechaCreacion: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  },
  fechaActualizacion: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
  }
})

// eslint-disable-next-line no-unused-vars
function handleVerMasInfoProcedimiento (procedimiento) {
  launchDialog({
    component: ModalMasInfoFolio,
    header: 'Más Información del Folio',
    width: '40vw',
    props: { procedimiento }
  })
}

function limpiarStore () {
  procedimientosBandeja_RESET_FOLIO_PROCEDIMIENTO_DATA()
  stepRegistroContacto_SET_DEFAULT_STATE()
  sujetosIntervinientes_SET_DEFAULT_STATE()
  delito_SET_DEFAULT_STATE()
  relaciones_SET_DEFAULT_STATE()
  especiesDinero_SET_DEFAULT_STATE()
  relato_SET_DEFAULT_STATE()
  documento_SET_DEFAULT_STATE()
  actividad_RESET_ACTIVIDADES()
  stepDiligencia_SET_DEFAULT_STATE()
  stepDetenidosACD_SET_DEFAULT_STATE()
  procedimientosBandeja_ES_NUEVA_ATENCION_FISCAL_SET_DEFAULT_STATE()
}

const sendToStep = (data, esInstruccion) => {
  limpiarStore()
  const dataProcedimiento = data.data.procedimiento
  const dataTarea = data.tarea
  stepRegistroContacto_SET_FOLIO(dataProcedimiento.idFolio)
  procedimientosBandeja_SET_FOLIO_PROCEDIMIENTO_DATA(dataProcedimiento)
  procedimientosBandeja_SET_TIENE_FOLIO(!!dataProcedimiento.idFolio)
  procedimientosBandeja_SET_ESFLAGRANTE(dataProcedimiento?.esDirectaFlagrante)
  procedimientosBandeja_SET_ESTADO_FOLIO(dataProcedimiento.codEstadoFolio === '2' ? 'Cerrado' : 'Abierto')
  pam_SET_PROCESO({
    ...dataTarea,
    processInstanceId: dataTarea.taskProcessInstanceId,
    taskInstanceId: dataTarea.taskId,
    idProcedimiento: dataProcedimiento.idProcedimiento,
    idDenuncia: dataProcedimiento.idDenuncia
  })
  if (($hasSomeRoles(fiscalTurno.value) && !tieneFolio.value) ||
   ($hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`]) && !tieneFolio.value)) {
    procedimientosBandeja_ES_NUEVA_ATENCION_FISCAL(true)
  }

  if (esInstruccion) {
    sendToInstrucciones()
  } else {
    sendTo()
  }
}

function sendToInstrucciones () {
  if ($hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`]) && tieneFolio.value) {
    requestUtil({ action: mantenedor_getInstitucionesDenuncia })
    router.push({ name: 'FlagranciaNuevaAtencionDiligenciasEInstruccionesFiscal' })
  } else if (tieneFolio.value) {
    requestUtil({ action: mantenedor_getInstitucionesDenuncia })
    router.push({ name: 'FlagranciaNuevaAtencionDiligenciasEInstrucciones' })
  } else {
    router.push('/flagrancia/nueva-atencion/registro-contacto')
  }
}
function sendTo () {
  if ($hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`]) && tieneFolio.value) {
    requestUtil({ action: mantenedor_getInstitucionesDenuncia })
    router.push({ name: 'FlagranciaNuevaAtencionRegistroContactoFiscal' })
  } else if (tieneFolio.value) {
    requestUtil({ action: mantenedor_getInstitucionesDenuncia })
    router.push({ name: 'FlagranciaNuevaAtencionDiligenciasEInstrucciones' })
  } else {
    router.push('/flagrancia/nueva-atencion/registro-contacto')
  }
}
// Acciones bandeja abiertas
// tipo de panel de Procedimientos (TabView - En Curso(abiertos), Cerrados)
const esTipoProcedimientosCerrados = computed(() => props.tipoPanelProcedimientos === 'cerradas')

// modal  Solicitud Cerrar Folio - Abierto
/* function abrirModalSolicitudCerrarFolio (procedimiento) {
  // buscar el procedimiento por folio
  console.log(procedimiento)
  launchDialog({
    component: ModalSolicitudCerrarFolio,
    header: 'Solicitud de Cerrar Folio',
    confirmLabel: 'Enviar Solicitud',
    width: '50%',
    props: { procedimiento },
    accept: (data) => {
      console.log(data, 'llamada para hacer la solicitud')
      //   launchConfirmDialog({
      //     message: `¿Estás seguro de cerrar el folio ${procedimiento.folio}?`,
      //     accept: () => {
      /*  requestUtil({
        action: procedimientosBandeja_postSolicitudCerrarFolio, // crear endpoint
        payload: payload(data.comentarioCierre), // guardar comentario
        resolve: () => toastSuccess(`Solicitud Enviada`),
        reject: () => toastError('Ocurrio un error al generar la solictud')
      })
      //     }
      //   })
    }
  })
} */

// modal Re-Abrir Folio - Cerrado
function abrirModalReAbrirFolio (folioAReAbrir) {
  const dataProcedimiento = folioAReAbrir.data.procedimiento
  if (!unidadPolicialId.value) {
    requestUtil({
      action: stepRegistroContacto_getRegistroContacto,
      payload: {
        'id-procedimiento': dataProcedimiento.idProcedimiento,
        'id-denuncia': dataProcedimiento.idDenuncia
      }
    })
  }
  launchDialog({
    component: ModalReAbrirFolio,
    header: 'Re-Abrir Folio',
    confirmLabel: 'Re-Abrir Folio',
    width: '50vh',
    props: {
      procedimiento: {
        folio: dataProcedimiento.idFolio,
        fiscalTurno: user.value.preferred_username,
        unidadPolicial: mantenedor_getNombreInstitucionesDenunciaById(unidadPolicialId.value),
        funcionarioResponsable: dataProcedimiento.nombreReponsable
      }
    },
    accept: (comentario) => {
      requestUtil({
        action: procedimientosBandeja_postReAbrirFolio,
        payload: {
          folio: dataProcedimiento.idFolio,
          ...comentario
        },
        resolve: () => {
          toastSuccess('Se re abrio el folio nro: ' + dataProcedimiento.idFolio)
        },
        reject: (e) => {
          console.error(e)
        }
      })
    }
  })
}

// modal Solicitud Re-Abrir Folio - Cerrado
function abrirModalSolicitudReAbrirFolio (folioAReAbrir) {
  const dataProcedimiento = folioAReAbrir.data.procedimiento
  console.log(folioAReAbrir)
  launchDialog({
    component: ModalSolicitudReAbrirFolio,
    header: 'Solicitud de Re-Abrir Folio',
    confirmLabel: 'Enviar',
    width: '45vw',
    props: {
      procedimiento: {
        folio: dataProcedimiento.idFolio,
        fiscalTurno: user.value.preferred_username,
        unidadPolicial: 'unidadPolicial',
        funcionarioResponsable: dataProcedimiento.nombreReponsable
      }
    },
    accept: (data) => {
      requestUtil({
        action: procedimientosBandeja_postReAbrirFolio,
        payload: {
          folio: dataProcedimiento.idFolio,
          ...data
        },
        resolve: () => {
          toastSuccess('Se re abrio el folio nro: ' + dataProcedimiento.idFolio)
        },
        reject: (e) => {
          console.error(e)
        }
      })
    }
  })
}

// modal Responder Solicitud Re-Abrir Folio - Re-Abierto
function abrirModalResponderSolicitudReAbrirFolio (folioAReAbrir) {
  const dataProcedimiento = folioAReAbrir.data.procedimiento
  launchDialog({
    component: ModalResponderSolicitudReAbrirFolio,
    header: 'Responder Solicitud Re-Abrir Folio',
    confirmLabel: 'Responder Solicitud',
    width: '50vh',
    props: {
      procedimiento: {
        folio: dataProcedimiento.idFolio,
        fiscalTurno: user.value.preferred_username,
        unidadPolicial: 'unidadPolicial',
        funcionarioResponsable: dataProcedimiento.nombreReponsable
      }
    },
    accept: (data) => {
      requestUtil({
        action: procedimientosBandeja_postResponderSolicitudReAbrirFolio,
        payload: {
          folio: dataProcedimiento.idFolio,
          ...data
        },
        resolve: (r) => {
          toastSuccess('Se acepto solicitud de re abrir el folio nro: ' + r.folio)
        },
        reject: (e) => {
          console.error(e.message)
        }
      })
    }
  })
}

// opciones de acciones de menu de Procedimientos
// const menuOpcionesProcedimientos = ref(null)
// folio seleccionado al abrir el menu de acciones
const menuOptionSelected = ref(null)

const opcionesProcedimientos = ref([
  {
    label: () => (esTipoProcedimientosCerrados.value ? 'Opciones Cerrados' : 'Opciones Abiertos'),
    items: [
      {
        label: 'Ejecutar',
        icon: 'pi pi-refresh',
        command: () => {
          sendToStep(menuOptionSelected.value)
        }
      },
      {
        label: 'Responder Solicitud Re-Abrir Folio',
        icon: 'pi pi-lock-open',
        command: () => {
          abrirModalResponderSolicitudReAbrirFolio(menuOptionSelected.value)
        },
        visible: false
        // visible: () => menuOptionSelected.value.data.procedimiento.codEstadoFolio === '2' && ($hasSomeRoles(fiscalTurno.value) || $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`]))
      },
      {
        label: 'Re-Abrir Folio',
        icon: 'pi pi-lock-open',
        command: () => {
          abrirModalReAbrirFolio(menuOptionSelected.value)
        },
        visible: () => menuOptionSelected.value.data.procedimiento.codEstadoFolio === '2' && ($hasSomeRoles(fiscalTurno.value) || $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`]))
      },
      {
        label: 'Solicitud de Re-Abrir Folio',
        icon: 'pi pi-unlock',
        command: () => {
          abrirModalSolicitudReAbrirFolio(menuOptionSelected.value)
        },
        visible: () => menuOptionSelected.value.data.procedimiento.codEstadoFolio === '2' && ($hasSomeRoles(policiaTurno.value) || $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_equipo_turnoif_TIN`]))
      }
    ]
  }
])

function handleInitChat (data) {
  launchDialog({
    component: ChatComponent,
    header: `Chat | Procedimiento: ${data.data?.procedimiento?.idDenuncia}`,
    width: '50vw',
    props: {
      roomId: data.data?.procedimiento?.idDenuncia
    }
  })
}
</script>
