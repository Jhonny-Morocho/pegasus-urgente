<template>
<section>
  <AppDataTable
    id="dataTableProcedimientos"
    v-bind="$attrs"
    ref="dt"
    class="mt-5"
    filter-display="menu"
    responsive-layout="scroll"
  >
    <Column header="Ver más">
      <template #body="{ data }">
        <Button
          class="btn-primary p-button-rounded"
          icon="pi pi-plus-circle"
          @click="openMasInfoTarea(data)"
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
          disabled
          icon="pi pi-flag-fill"
          @click="setPrioritario(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="nombreTarea"
      filter-field="nombreTarea"
      header="Nombre de la Tarea"
      :sortable="true"
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline"
          :label="data.tarea.taskName ?? 'Preclasificar Causa'"
          @click="sendToTarea(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="ruc"
      filter-field="ruc"
      header="RUC"
      :sortable="true"
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
      field="nombreCausa"
      filter-field="nombreCausa"
      header="Nombre Causa"
      :sortable="true"
    >
      <template #body="{ data: { data } }">
        {{ data?.causa?.nombre }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="nombreImputado"
      filter-field="Imputado"
      header="Nombre Imputado"
      :sortable="true"
    >
      <template #body="{ data: { data } }">
        <div v-if="data?.causa?.imputados?.length">
          <ul
            v-for="imp in data?.causa?.imputados"
            :key="imp.idPersona"
            class="list-none pl-0"
          >
            <li>{{ imp.nombre }}</li>
          </ul>
        </div>
        <span v-else>N/A</span>
      </template>
    </Column>
    <Column
      class="text-center"
      field="rutImputado"
      filter-field="rutImputado"
      header="Rut Imputado"
      :sortable="true"
    >
      <template #body="{ data: { data } }">
        <div v-if="data?.causa?.imputados?.length">
          <ul
            v-for="imp in data?.causa?.imputados"
            :key="imp.idPersona"
            class="list-none pl-0"
          >
            <li>{{ imp.rut }}</li>
          </ul>
        </div>
        <span v-else>N/A</span>
      </template>
    </Column>
    <Column
      class="text-center"
      field="imputadoEnOtraCausa"
      filter-field="imputadoEnOtraCausa"
      header="Imputado En Otra Causa"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ data.imputadoEnOtraCausa ? 'Si' : 'No' }}
      </template>
    </Column>
    <Column
      field="delito"
      filter-field="delito"
      header="Delito"
      :sortable="true"
    >
      <template #body="{ data: { data } }">
        <div v-if="data?.causa?.delitos?.length">
          <ul
            v-for="delito in data?.causa?.delitos"
            :key="delito.tipoDelito"
            class="list-none pl-0"
          >
            <li>
              {{
                getNombreTipoDelitoById(delito.tipoDelito) ||
                  delito.hechoDelictual
              }}
            </li>
          </ul>
        </div>
        <span v-else>N/A</span>
      </template>
    </Column>

    <Column
      class="text-center"
      field="alerta"
      filter-field="alerta"
      header="Alerta"
      :sortable="true"
    >
      <template #body="{ data: { data } }">
        {{ data?.causa?.alerta ? formatAlerta(data?.causa?.alerta) : 'N/A' }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="fechaHoraRecepcion"
      filter-field="fechaHoraRecepcion"
      header="Fecha y Hora de Asignación"
      :sortable="true"
    >
      <template #body="{ data: { tarea } }">
        {{ formatFecha(tarea?.taskCreatedOnDate) }}
      </template>
    </Column>
    <Column
      class="text-center p-0"
      field="tiempoDeEspera"
      filter-field="tiempoDeEspera"
      header="Tiempo de Espera"
      sortable
    >
      <template #body="{ data: { tarea } }">
        <TiempoEspera :fecha="tarea?.taskCreatedOnDate" />
      </template>
    </Column>
    <Column
      class="text-center"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="causaSeleccionada"
          :menu-options="opcionesBandeja"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { appUtil, dateTimeUtil, requestUtil } from '@/utils'
import {
  useActividadStore,
  useBuscarDuplicidadStore,
  useDelitoStore,
  useDocumentoStore,
  useEspeciesDineroStore,
  useGeorreferenciaStore,
  useMantenedorStore,
  usePamStore,
  useRelacionesStore,
  useRelatoStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'
import {
  useAntecedentesCausaData,
  useBandejaPreclasificadorStore,
  useCausaPreclasificadorStore,
  useFlujoPamPreclasificador
} from '@/modules/preclasificador/composables'
import { useFichaCausa } from '@/modules/ficha-causa/composables'
import TiempoEspera from '@/modules/global/components/utilities/TiempoEspera.vue'
import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'
import ModalMasInfoTarea from '@/modules/preclasificador/components/modals/bandeja/ModalMasInfoTarea.vue'

const router = useRouter()

const { scrollTo, includeWord, taskStatus } = appUtil

const { launchDialog } = useAppDialog()
const { toastWarning, toastError } = useAppToast()

const { flujoOrigen, sendToFichaCausa } = useFichaCausa()

const {
  procesoPam,
  pam_SET_PROCESO,
  pam_getDiagramaProcesoActual,
  pam_getDiagramaProcesoPrincipal
} = usePamStore()

const { bandejaPreclasificador_togglePrioritario } =
  useBandejaPreclasificadorStore()

const { mantenedor_getNombreTipoDelito } = useMantenedorStore()

const {
  causaPreclasificador_SET_RUC,
  causaPreclasificador_SET_ID_DENUNCIA,
  causaPreclasificador_SET_CAUSA_ACTUAL,
  causaPreclasificador_SET_DEFAULT_STATE,
  causaPreclasificador_iniciarYReservar
} = useCausaPreclasificadorStore()

const { buscarDuplicidad_RESET } = useBuscarDuplicidadStore()
const { delito_SET_DEFAULT_STATE } = useDelitoStore()
const { relaciones_SET_DEFAULT_STATE } = useRelacionesStore()
const { especiesDinero_SET_DEFAULT_STATE } = useEspeciesDineroStore()
const { relato_SET_DEFAULT_STATE } = useRelatoStore()
const { documento_SET_DEFAULT_STATE } = useDocumentoStore()
const { sujetosIntervinientes_SET_DEFAULT_STATE } =
  useSujetosIntervinientesStore()
const { georreferencia_RESET_FISCALIAS_COMPETENTES } = useGeorreferenciaStore()
const { actividad_RESET_ACTIVIDADES } = useActividadStore()
const { resetAntecedentesCausaData } = useAntecedentesCausaData()
const { resetFlujoPamPreclasificador } = useFlujoPamPreclasificador()

const causaSeleccionada = ref(null)

function prioritarioStyle (value) {
  return value ? 'p-button-secondary' : 'p-button-warning'
}

function openMasInfoTarea (tareaCausa) {
  const { data, tarea } = tareaCausa
  launchDialog({
    component: ModalMasInfoTarea,
    header: 'Más Información',
    width: '40%',
    props: {
      tarea,
      dataCausa: data
    },
    cancelLabel: 'Cerrar'
  })
}

const opcionesBandeja = ref([
  {
    label: 'Acciones para la tarea',
    items: [
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
        label: 'Ver Carpeta',
        command: () => {
          console.log('*se abre la carpeta*')
        }
      }
    ]
  }
])

function getNombreTipoDelitoById (id) {
  return mantenedor_getNombreTipoDelito(id)
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
      return imagenProcesoPrincipal
    }
  })
  await requestUtil({
    action: pam_getDiagramaProcesoActual,
    payload: { taskId: tarea.taskId },
    resolve: (res) => {
      imagenProcesoActual = res
      return imagenProcesoActual
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

async function sendToTarea (tareaCausa) {
  resetFUD()
  const { tarea, data } = tareaCausa

  causaPreclasificador_SET_DEFAULT_STATE()

  causaPreclasificador_SET_RUC(data?.causa?.ruc)
  causaPreclasificador_SET_ID_DENUNCIA(data?.causa?.idDenuncia)
  causaPreclasificador_SET_CAUSA_ACTUAL(data)

  pam_SET_PROCESO(tarea)

  // si la tarea esta InProgress mandar directamente al step correspondiente
  if (includeWord(tarea.taskStatus, taskStatus.IN_PROGRESS)) {
    pushToStep(tarea.taskName)
  }

  // si la tarea esta Ready iniciar, reservar y mandar al step correspondiente
  if (includeWord(tarea.taskStatus, taskStatus.READY)) {
    requestUtil({
      action: causaPreclasificador_iniciarYReservar,
      payload: { ...procesoPam.value },
      resolve: (data) => {
        console.log(data)
        // manda al step que le corresponde dependiendo del nombre de la tarea
        pushToStep(tarea.taskName)
      },
      reject: (err) => {
        console.error(err)
        toastError(`Ha ocurrido un error al visualizar la causa.`)
      }
    })
  }

  // si la tarea esta Completed mandar al step 1, POR HACER: Modificar logica cuando la tarea esta completada para que no realice llamadas al cambiar de step
  if (includeWord(tarea.taskStatus, taskStatus.COMPLETED)) {
    router.push({ name: 'VCAAntecedentesCausa' })
  }

  scrollTo(0)
}

function pushToStep (nombreTarea) {
  if (includeWord(nombreTarea, 'Revisar calidad')) {
    router.push({ name: 'VCAAntecedentesCausa' })
  }
  if (includeWord(nombreTarea, 'Revisar rechazo')) {
    router.push({ name: 'VCAAntecedentesCausa' })
  }
  if (includeWord(nombreTarea, 'Solicitar Antecedentes')) {
    router.push({ name: 'VCADiligencias' })
  }
  if (
    includeWord(
      nombreTarea,
      'Evaluar información y definir / decidir propuesta'
    )
  ) {
    router.push({ name: 'PAAnalizarPreclasificacion' })
  }
  if (includeWord(nombreTarea, 'Clasificar por complejidad')) {
    router.push({ name: 'PASeguirLineaInvestigativa' })
  }
  if (
    includeWord(nombreTarea, 'Separar causas de otra competencia territorial')
  ) {
    router.push({ name: 'PATransferirCausa' })
  }
  if (includeWord(nombreTarea, 'Agrupar Causas')) {
    router.push({ name: 'PAAgruparCausa' })
  }
  if (includeWord(nombreTarea, 'Indicar motivo y tipo de término')) {
    router.push({ name: 'PADesestimarCausa' })
  }
}

async function setPrioritario (data) {
  requestUtil({
    action: bandejaPreclasificador_togglePrioritario,
    payload: {
      idBandeja: data.idBandeja,
      prioritario: !data.prioritario
    },
    resolve: (response) => {
      const message = response.prioritario
        ? 'ahora es prioritaria'
        : 'ya no es prioritaria'
      toastWarning(`La causa con RUC ${response.ruc} ${message}`)
    }
  })
}

function openFichaCausa (tareaCausa) {
  const { tarea, data } = tareaCausa
  const { causa } = data

  resetFUD()

  pam_SET_PROCESO(tarea)

  sendToFichaCausa({
    origenCausa: flujoOrigen.TRANSVERSAL,
    ruc: causa?.ruc,
    idCausa: causa?.idCausa,
    idDenuncia: causa?.idDenuncia,
    newTab: true
  })
}

function formatFecha (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

function formatAlerta (value) {
  // /,/g => todas las comas en el string
  return value?.replace(/,/g, ', ')
}

function resetFUD () {
  georreferencia_RESET_FISCALIAS_COMPETENTES()
  buscarDuplicidad_RESET()
  delito_SET_DEFAULT_STATE()
  relaciones_SET_DEFAULT_STATE()
  especiesDinero_SET_DEFAULT_STATE()
  relato_SET_DEFAULT_STATE()
  documento_SET_DEFAULT_STATE()
  sujetosIntervinientes_SET_DEFAULT_STATE()
  actividad_RESET_ACTIVIDADES()
  resetAntecedentesCausaData()
  resetFlujoPamPreclasificador()
}
</script>
