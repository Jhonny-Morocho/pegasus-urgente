<template>
<section class="mt-5">
  <AppDataTable
    id="tabla-dirigir-investigacion"
    v-bind="$attrs"
    ref="dt"
    filter-display="menu"
    responsive-layout="scroll"
  >
    <Column header="Ver más">
      <template #body="{ data }">
        <Button
          class="p-button-rounded p-button-outlined"
          :disabled="noColumnMasInfo"
          icon="pi pi-plus"
          @click="openMasInfoTarea(data?.data?.causa)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="prioritario"
      filter-field="prioritario"
      header="Prioritario"
    >
      <template #body="{ data }">
        <Button
          class="p-button-rounded p-button-outlined"
          :class="prioritarioStyle(data?.prioritario)"
          icon="pi pi-flag-fill"
          @click="setCausaPrioritaria(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="nombreTarea"
      filter-field="nombreTarea"
      header="Nombre de la Tarea"
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline"
          :label="data?.tarea?.taskName"
          @click="sendToTarea(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="ruc"
      filter-field="ruc"
      header="RUC"
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline w-max"
          :label="data?.data?.causa?.ruc"
          @click="openFichaCausa(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="alerta"
      filter-field="alerta"
      header="Alerta"
    >
      <template #body="{ data }">
        {{ data?.data?.causa?.alerta || "N/A" }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="causaJudicializada"
      filter-field="causaJudicializada"
      header="Causa Judicializada"
    >
      <template #body="{ data }">
        {{ data?.data?.causa?.causaJudicializada || "N/A" }}
      </template>
    </Column>
    <Column
      class="text-left"
      field="imputado"
      filter-field="imputado"
      header="Imputado"
    >
      <template #body="{ data: { data } }">
        <div v-if="data?.causa?.imputados?.length">
          <ul
            v-for="imp in data?.causa?.imputados"
            :key="imp.idPersona"
            class="list-none pl-0"
          >
            <li>{{ imp.nombre }} {{ imp.apellido }}</li>
          </ul>
        </div>
        <span v-else>N/A</span>
      </template>
    </Column>
    <Column
      class="text-left"
      field="delito"
      filter-field="delito"
      header="Delito"
    >
      <template #body="{ data: { data } }">
        <div
          v-if="data?.causa?.delitos?.length"
          :class="data?.causa?.delitos ? 'text-sm text-left' : ''"
        >
          <ul
            v-for="delito in data?.causa?.delitos"
            :key="delito.tipoDelito"
            class="list-none pl-0"
          >
            <li>
              {{
                getNombreTipoDelitoById(delito?.tipoDelito) ||
                  delito?.hechoDelictual
              }}
            </li>
          </ul>
        </div>
        <div v-else>
          N/A
        </div>
      </template>
    </Column>
    <Column
      class="text-left"
      field="victima"
      filter-field="victima"
      header="Víctima"
    >
      <template #body="{ data }">
        <section v-if="data?.data?.causa?.victimas?.length > 0">
          {{
            `${data?.data?.causa?.victimas[0]?.nombre} ${data?.data?.causa?.victimas[0]?.apellido}`
          }}
        </section>
        <section v-else>
          N/A
        </section>
      </template>
    </Column>

    <Column
      class="text-center"
      header="Días desde Última Actividad"
    >
      <template #body="{ data: { data } }">
        {{ data.causa?.diasUltimaActividad || "N/A" }}
      </template>
    </Column>

    <Column
      class="text-center"
      header="Fecha/Hora Última Actividad"
    >
      <template #body="{ data: { data } }">
        {{ data.causa?.fechaHoraUltimaActividad || "N/A" }}
      </template>
    </Column>
    <Column
      class="text-center"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="causaSeleccionada"
          :menu-options="opcionesCausa"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { requestUtil, appUtil } from '@/utils'
import { useDirigirInvestigacionStore } from '../composables'
import {
  useCausasRelacionadasStore,
  useDelitoStore,
  useDiligenciaStore,
  useMantenedorStore,
  usePamStore,
  useRelacionesStore,
  useRelatoStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'
import { useFichaCausa } from '@/modules/ficha-causa/composables'
import ModalVerMasCausa from '@/modules/dirigir-investigacion/components/modals/ModalVerMasCausa.vue'
import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'
import ModalRelaciones from './modals/ModalRelaciones.vue'

const { launchDialog } = useAppDialog()
const { toastError } = useAppToast()
const { includeWord, taskStatus: taskStatusEnum } = appUtil

const { flujoOrigen, sendToFichaCausa } = useFichaCausa()

const {
  procesoPam,
  pam_SET_PROCESO,
  pam_reservarIniciarTarea,
  pam_getDiagramaProcesoPrincipal,
  pam_getDiagramaProcesoActual
} = usePamStore()

const {
  dirigirInvestigacion_SET_RUC,
  dirigirInvestigacion_SET_CAUSA,
  dirigirInvestigacion_SET_ID_DENUNCIA,
  dirigirInvestigacion_SET_DEFAULT_STATE
} = useDirigirInvestigacionStore()

const {
  solicitudes_SET_RUC,
  solicitudes_SET_ID_DENUNCIA,
  solicitudes_SET_ID_CAUSA,
  solicitudes_SET_DEFAULT_STATE,
  solicitudes_iniciarYReservar,
  solicitudes_SET_DATA_SELECTOR_SOLICITUD
} = useSolicitudesStore()

const { sujetosIntervinientes_SET_DEFAULT_STATE } =
  useSujetosIntervinientesStore()

const { delito_SET_DEFAULT_STATE } = useDelitoStore()
const { relaciones_SET_DEFAULT_STATE } = useRelacionesStore()
const { relato_SET_DEFAULT_STATE } = useRelatoStore()
const { diligencia_RESET_DILIGENCIAS } = useDiligenciaStore()
const { causasRelacionadas_SET_DEFAULT_STATE } = useCausasRelacionadasStore()

const {
  subtipoActividadList,
  subSubtipoActividadList,
  mantenedor_getNombreTipoDelito,
  mantenedor_getTipoActividadByCodigoActividad
} = useMantenedorStore()

defineProps({
  noColumnMasInfo: {
    type: Boolean,
    default: () => false
  }
})

const router = useRouter()
const causaSeleccionada = ref()

function getNombreTipoDelitoById (id) {
  return mantenedor_getNombreTipoDelito(id)
}

function openMasInfoTarea (causa) {
  launchDialog({
    component: ModalVerMasCausa,
    header: 'Más Información de la Causa',
    width: '48%',
    props: { data: causa },
    cancelLabel: 'Cerrar'
  })
}

function setCausaPrioritaria (causa) {
  console.log(causa)
}

function sendToTarea (causaInfo) {
  // Resetear estados de las stores correspondientes (NO mantenedores)
  dirigirInvestigacion_SET_DEFAULT_STATE()
  sujetosIntervinientes_SET_DEFAULT_STATE()
  delito_SET_DEFAULT_STATE()
  relaciones_SET_DEFAULT_STATE()
  relato_SET_DEFAULT_STATE()
  diligencia_RESET_DILIGENCIAS()
  solicitudes_SET_DEFAULT_STATE()
  causasRelacionadas_SET_DEFAULT_STATE()

  dirigirInvestigacion_SET_CAUSA(causaInfo)
  dirigirInvestigacion_SET_RUC(causaInfo?.data?.causa?.ruc)
  dirigirInvestigacion_SET_ID_DENUNCIA(causaInfo?.data?.causa?.idDenuncia)

  // Definir si se usará la store de gestionSolicitudes de esta forma WIP
  console.log(causaInfo, 'causaInfo')
  solicitudes_SET_RUC(causaInfo?.data?.causa?.ruc)
  solicitudes_SET_ID_DENUNCIA(causaInfo?.data?.causa?.idDenuncia)
  solicitudes_SET_ID_CAUSA(causaInfo?.data?.causa?.idCausa)

  pam_SET_PROCESO(causaInfo?.tarea)

  const { taskName, taskStatus } = procesoPam.value

  if (
    includeWord(taskStatus, taskStatusEnum.IN_PROGRESS) ||
    includeWord(taskStatus, taskStatusEnum.RESERVED)
  ) {
    pushToStep(taskName)
  }

  if (includeWord(taskStatus, taskStatusEnum.READY)) {
    requestUtil({
      action: pam_reservarIniciarTarea,
      payload: {
        ...procesoPam.value,
        taskInstanceId: procesoPam.value?.taskId
      },
      resolve: () => {
        pushToStep(taskName)
      },
      reject: (err) => {
        console.error(err)
        toastError(`Ha ocurrido un error al visualizar la causa.`)
      }
    })
  }
}

function openFichaCausa (tareaCausa) {
  const { tarea, data } = tareaCausa
  const { causa } = data

  pam_SET_PROCESO(tarea)

  sendToFichaCausa({
    origenCausa: flujoOrigen.TRANSVERSAL,
    ruc: causa?.ruc,
    idCausa: causa?.idCausa,
    idDenuncia: causa?.idDenuncia,
    newTab: true
  })
}

async function iniciarYReservarTarea ({ resolve, taskId }) {
  requestUtil({
    action: solicitudes_iniciarYReservar,
    payload: {
      idTarea: taskId,
      tareaPam: procesoPam.value
    },
    resolve,
    reject: (err) => {
      console.error(err)
    }
  })
}

const tareasDirigirInvestigacion = [
  { nombreTarea: 'Analizar Agrupación', routeName: 'DIACADefinirCausasAgrupar' },
  { nombreTarea: 'Analizar causas a agrupar', routeName: 'DIACADefinirCausasAgrupar' },
  { nombreTarea: 'Consultar FR', routeName: 'DIConsultarCierreInvestigacion' },
  { nombreTarea: 'Consultar a FR por Cierre de Investigación', routeName: 'DIConsultarCierreInvestigacion' },
  { nombreTarea: 'Preparar Cierre', routeName: 'DIComunicarCierreInvestigacion' },
  { nombreTarea: 'Evaluar Resultado de Cierre', routeName: 'DIEvaluarResultadoCierre' },
  { nombreTarea: 'Preparar Acusación', routeName: 'DIPAGeneral' },
  { nombreTarea: 'Gestionar Previo Resolver', routeName: 'DIRevisarRespuesta' },
  { nombreTarea: 'Definir nueva causa', routeName: 'DIDefinirNuevaCausa' },
  { nombreTarea: 'Definir redistribución de Especies y Dinero', routeName: 'DIDefinirNuevaCausa' },
  { nombreTarea: 'Revisar Antecedentes de la Causa', routeName: 'DIRAResumenCausa' },
  { nombreTarea: 'Decidir Acciones', routeName: 'DIDesarrolloInvestigacion' },
  { nombreTarea: 'Tomar Decision de la Causa Relacion', routeName: 'DIDefinirCursoCausa' },
  { nombreTarea: 'Ingresar Directriz', routeName: 'DIIngresarDirectrizInvestigacion' },
  { nombreTarea: 'Actualizar Directriz', routeName: 'DIActualizarDirectrizInvestigacion' }
]

const tareasSolicitud = [
  {
    nombreTarea: 'formalizacion',
    codigoSubtipo: '241', // CODIGO 241: DE AUDIENCIA
    codigoSubSubtipo: '15' // CODIGO 15: Formalización de la investigación
  },
  {
    nombreTarea: 'detencion',
    codigoSubtipo: '5029', // CODIGO 5029: Orden de detención
    codigoSubSubtipo: null
  },
  {
    nombreTarea: 'cautelares',
    codigoSubtipo: '2412', // CODIGO 2412: SOLICITUD DE MEDIDA CAUTELAR REAL
    codigoSubSubtipo: null
  }
]

async function pushToStep (nombreTarea) {
  const tareaSolicitudFound = tareasSolicitud.find(
    tareaSolicitud => includeWord(nombreTarea, tareaSolicitud.nombreTarea)
  )

  if (tareaSolicitudFound) {
    handleSolicitud({
      codigoSubtipo: tareaSolicitudFound.codigoSubtipo,
      codigoSubSubtipo: tareaSolicitudFound.codigoSubSubtipo
    })
    return
  }

  const tareaDirigirInvestigacionFound = tareasDirigirInvestigacion.find(
    tareaDirigirInvestigacion => includeWord(nombreTarea, tareaDirigirInvestigacion.nombreTarea)
  )

  router.push({ name: tareaDirigirInvestigacionFound.routeName })
}

async function handleSolicitud ({ codigoSubtipo, codigoSubSubtipo }) {
  await requestUtil({
    action: mantenedor_getTipoActividadByCodigoActividad,
    payload: { params: { codigo: '24' } }
  })

  const subtipoActividad = subtipoActividadList.value.find(
    (activ) => activ.codigo === codigoSubtipo
  )

  const dataSelector = {
    selectorSubTipo: '',
    selectorSubSubTipo: null,
    esReservada: null,
    esUrgente: null,
    fromSelector: false
  }

  dataSelector.selectorSubTipo = subtipoActividad?.id

  if (codigoSubSubtipo) {
    const subSubtipoActividad = subSubtipoActividadList.value.find(
      (subActiv) => subActiv.codigo === codigoSubSubtipo
    )

    dataSelector.selectorSubSubTipo = subSubtipoActividad?.id || null
  }

  iniciarYReservarTarea({
    resolve: () => {
      solicitudes_SET_DATA_SELECTOR_SOLICITUD(dataSelector)
      router.push({ name: 'solicitudResumenRelacionesEspecies' })
    },
    taskId: procesoPam.value?.taskId
  })
}

function prioritarioStyle (value) {
  return value ? 'p-button-secondary' : 'p-button-warning'
}

async function verProceso ({ tarea }) {
  let imagenProcesoPrincipal = null
  let imagenProcesoActual = null

  // NO QUITAR AWAIT
  await requestUtil({
    action: pam_getDiagramaProcesoPrincipal,
    payload: { taskId: tarea.taskId },
    resolve: (imagen) => {
      imagenProcesoPrincipal = imagen
    }
  })
  await requestUtil({
    action: pam_getDiagramaProcesoActual,
    payload: { taskId: tarea.taskId },
    resolve: (res) => {
      imagenProcesoActual = res
    }
  })

  launchDialog({
    component: ModalDiagramaPam,
    width: '90%',
    showHeader: false,
    props: {
      taskId: tarea.taskId,
      imagenProcesoPrincipal: imagenProcesoPrincipal,
      imagenProcesoActual: imagenProcesoActual
    }
  })
}

const opcionesCausa = ref([
  {
    label: 'Ejecutar Tarea',
    command: () => {
      sendToTarea(causaSeleccionada.value)
    }
  },
  {
    label: 'Ver Procesos',
    command: () => {
      verProceso(causaSeleccionada.value)
    }
  },
  {
    label: 'Ver Relaciones',
    command: () => {
      launchDialog({
        component: ModalRelaciones,
        header: 'Relaciones',
        width: '80%',
        props: {
          pIdDenuncia: causaSeleccionada.value?.data?.causa?.idDenuncia
        }
      })
      console.log(causaSeleccionada.value?.data?.causa?.idDenuncia)
    }
  }
])
</script>
