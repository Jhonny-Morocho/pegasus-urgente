<template>
<section>
  <AppDataTable
    id="dataTableDenunciass"
    v-bind="$attrs"
    ref="dt"
    v-model:contextMenuSelection="denunciaSeleccionada"
    class="mt-5"
    context-menu
    filter-display="menu"
    responsive-layout="scroll"
    @row-contextmenu="onRowContextMenu"
  >
    <Column header="Ver más">
      <template #body="{ data }">
        <Button
          class="btn-primary p-button-rounded"
          icon="pi pi-plus-circle"
          @click="openModalMasInfoDenuncia(data)"
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
          :disabled="data.estadoTarea === 'Completada'"
          icon="pi pi-flag-fill"
          @click="setPrioritario(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="tarea.taskName"
      filter-field="tarea.taskName"
      header="Nombre Tarea"
      :sortable="true"
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline"
          :label="data?.tarea.taskName"
          @click="sendTo(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="tarea.taskStatus"
      filter-field="tarea.taskStatus"
      header="Estado Tarea"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ estadoTarea(data.tarea.taskStatus) }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="data.causa?.imputados[0]"
      filter-field="data.causa?.imputados[0]"
      header="Nombre Imputado"
      :sortable="true"
    >
      <template #body="{ data }">
        <p>
          {{ data?.data?.causa?.imputados?.length ? `${data?.data?.causa?.imputados[0]?.nombre} ${data?.data?.causa?.imputados[0]?.apellido}` : 'Sin Imputado' }}
        </p>
      </template>
    </Column>
    <Column
      class="text-center"
      field="rutImputado"
      filter-field="rutImputado"
      header="Rut Imputado"
      :sortable="true"
    >
      <template #body="{ data }">
        <p>
          {{ data?.data?.causa?.imputados?.length ? format(data?.data?.causa?.imputados[0]?.rut) : 'N/A' }}
        </p>
      </template>
    </Column>
    <Column
      class="text-center"
      field="data.imputadoEnOtraCausa"
      filter-field="data.imputadoEnOtraCausa"
      header="Imputado En Otra Causa"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ data.imputadoEnOtraCausa ? 'SI' : 'NO' }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="delito"
      filter-field="delito"
      header="Delito"
      :sortable="true"
    >
      <template #body="{ data }">
        <div v-if="data?.data?.causa?.delitos.length > 0">
          <p>
            {{ getNombreTipoDelitoById(data.data?.causa?.delitos[0].tipoDelito) }}
          </p>
        </div>
        <div v-if="!data.data?.causa?.delitos">
          <p>
            {{ 'N/A' }}
          </p>
        </div>
      </template>
    </Column>
    <Column
      class="text-center"
      field="alerta"
      filter-field="alerta"
      header="Alerta"
      :sortable="true"
    >
      <template #body="{ data }">
        <p>
          {{ data?.data?.denuncia?.alerta ?? 'N/A' }}
        </p>
      </template>
    </Column>
    <Column
      class="text-center"
      field="tarea.taskCreatedOnDate"
      filter-field="tarea.taskCreatedOnDate"
      header="Fecha/Hora Asignación"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ dateTimeUtil.formatToFrontendWithTime(data.tarea.taskCreatedOnDate) ?? 'N/A' }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="tarea.taskCreatedOnLdt"
      filter-field="tarea.taskCreatedOnLdt"
      header="Fecha/Hora Recepción"
      :sortable="true"
    >
      <template #body="{ data }">
        <p>
          {{ data.tarea.taskCreatedOnLdt ? dateTimeUtil.formatToFrontendWithTime(data.tarea.taskCreatedOnLdt) : 'N/A' }}
        </p>
      </template>
    </Column>

    <Column
      class="text-center"
      field="tarea.taskCreatedOnDate"
      filter-field="tarea.taskCreatedOnDate"
      header="Tiempo de Espera"
    >
      <template #body="{ data }">
        <TiempoEspera :fecha="data.tarea.taskCreatedOnDate" />
      </template>
    </Column>
    <Column
      class="text-center"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="denunciaSeleccionada"
          :menu-options="accionesBandejaIngreso"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
  <ContextMenu
    ref="cm"
    :model="accionesBandejaIngreso"
  />
</section>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { format } from '@fiquu/cl-rut'
import ContextMenu from 'primevue/contextmenu'
import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'
import ModalMasInfoDenuncia from '../componentes/bandeja/modals/ModalMasInfoDenuncia.vue'
import TiempoEspera from '@/modules/global/components/utilities/TiempoEspera.vue'

import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { useBandejaAtendedorJuridico, useCrearCausaStore } from '../composables'

import {
  useDelitoStore,
  useMantenedorStore,
  useDocumentoStore,
  useEspeciesDineroStore,
  usePamStore,
  useRelacionesStore,
  useRelatoStore,
  useSujetosIntervinientesStore,
  useBuscarDuplicidadStore
} from '@/modules/global/composables'

import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

import { dateTimeUtil, requestUtil } from '@/utils'
import { useFichaCausa, useFichaCausaStore } from '@/modules/ficha-causa/composables'

const { launchDialog } = useAppDialog()
const { fichaCausa_getCausa } = useFichaCausaStore()
const { bandejaAtendedorJuridico_setPrioritario } = useBandejaAtendedorJuridico()
const { crearCausa_SET_DEFAULT_STATE, crearCausa_SET_TIPO_DENUNCIA } = useCrearCausaStore()
const {
  pam_getDiagramaProcesoPrincipal,
  pam_getDiagramaProcesoActual,
  pam_SET_PROCESO
} = usePamStore()
const { mantenedor_getNombreTipoDelito } = useMantenedorStore()
const { toastSuccess, toastWarning } = useAppToast()
const router = useRouter()

const { buscarDuplicidad_RESET } = useBuscarDuplicidadStore()
const { delito_SET_DEFAULT_STATE } = useDelitoStore()
const { relaciones_SET_DEFAULT_STATE } = useRelacionesStore()
const { especiesDinero_SET_DEFAULT_STATE } = useEspeciesDineroStore()
const { relato_SET_DEFAULT_STATE } = useRelatoStore()
const { documento_SET_DEFAULT_STATE } = useDocumentoStore()
const { sujetosIntervinientes_SET_DEFAULT_STATE } = useSujetosIntervinientesStore()
const { identificacionDenuncia, identificacionDenuncia_SET_DEFAULT_STATE, identificacionDenuncia_getTipoDenuncia, identificacionDenuncia_getByIdDenuncia } = useIdentificacionDenunciaStore()

const denunciaSeleccionada = ref()
const cm = ref()

const emit = defineEmits(['tasking'])

function openModalMasInfoDenuncia (denuncia) {
  launchDialog({
    component: ModalMasInfoDenuncia,
    header: 'Más Información de la Denuncia',
    width: '30%',
    props: { denuncia }
  })
}
function getNombreTipoDelitoById (id) {
  return mantenedor_getNombreTipoDelito(id)
}

function prioritarioStyle (value) {
  return value ? 'p-button-secondary' : 'p-button-warning'
}
function estadoTarea (estado) {
  let state = estado
  if (estado === 'Created') {
    state = 'Creada'
  } else if (estado === 'Ready') {
    state = 'Lista'
  } else if (estado === 'Reserved') {
    state = 'Reservada'
  } else if (estado === 'InProgress') {
    state = 'En Proceso'
  } else if (estado === 'Completed') {
    state = 'Completada'
  }
  return state
}
function setPrioritario (data) {
  requestUtil({
    action: bandejaAtendedorJuridico_setPrioritario,
    payload: {
      denuncia: data,
      isPrioritario: !data.prioritario
    },
    resolve: (res) => {
      res.denuncia.estadoTarea === 'Prioritaria' ? toastSuccess('Es Prioritaria') : toastWarning('No es Prioritaria')
      console.log(res)
    },
    reject: (err) => {
      console.log(err)
    }
  })
}

const { flujoOrigen, sendToFichaCausa } = useFichaCausa()

function limpiarStore () {
  identificacionDenuncia_SET_DEFAULT_STATE()
  sujetosIntervinientes_SET_DEFAULT_STATE()
  delito_SET_DEFAULT_STATE()
  relaciones_SET_DEFAULT_STATE()
  especiesDinero_SET_DEFAULT_STATE()
  relato_SET_DEFAULT_STATE()
  documento_SET_DEFAULT_STATE()
  buscarDuplicidad_RESET()
  crearCausa_SET_DEFAULT_STATE()
}

function getIdentificacionDenuncia(id){
  requestUtil({
    action: identificacionDenuncia_getByIdDenuncia,
    payload: { idDenuncia: id }
  })
  console.log('identificacion denuncia desde bandeja', identificacionDenuncia)
}

async function sendTo (data) {
  emit('tasking', true)
  limpiarStore()
  const { idDenuncia, idCausa } = data.data.denuncia
  const { taskProcessInstanceId, taskId } = data.tarea
  getIdentificacionDenuncia(idDenuncia)
  identificacionDenuncia_getTipoDenuncia('1')
  crearCausa_SET_TIPO_DENUNCIA('Directa')
  pam_SET_PROCESO({
    ...data.tarea,
    idDenuncia,
    idCausa,
    processInstanceId: taskProcessInstanceId.toString(),
    taskInstanceId: taskId.toString()
  })

  if (data.tarea.taskStatus === 'Completed' || data.tarea.taskName === 'Revisar Antedecentes') {
    requestUtil({
      action: fichaCausa_getCausa,
      payload: { idDenuncia: idDenuncia },
      loader: (l) => {
        emit('tasking', l)
      },
      resolve: ({ rolUnico }) => {
        sendToFichaCausa({
          origenCausa: flujoOrigen.TRANSVERSAL,
          ruc: rolUnico,
          idCausa: idCausa,
          idDenuncia: idDenuncia,
          newTab: true
        })
      },
      reject: (err) => {
        console.error(err)
      }
    })
  } else if (data.tarea.taskName === 'Identificar duplicidad de Denuncia') {
    router.push(`/ingreso/denuncia-directa/nueva-denuncia/buscar-duplicidad`)
  } else if (data.tarea.taskName === 'Registrar datos de la Denuncia') {
    router.push(`/ingreso/denuncia-directa/nueva-denuncia/sujetos-intervinientes`)
  }
}

function onRowContextMenu (event) {
  cm.value.show(event.originalEvent)
}

const accionesBandejaIngreso = ref([
  {
    label: 'Acciones para la tarea',
    items: [
      {
        label: 'Ejecutar Tarea',
        command: () => {
          sendTo(denunciaSeleccionada.value)
        }
      },
      {
        label: 'Ver Proceso',
        command: () => {
          handleDiagramaPam(denunciaSeleccionada.value)
        }
      }
      //   {
      //     label: 'Anular Tarea',
      //     command: () => {
      //       console.log('*Se detiene el tiempo de espera de la denuncia*')
      //     }
      //   }
    ]
  }
  //   {
  //     label: 'Anular Tarea',
  //     command: () => {
  //       console.log('*Se detiene el tiempo de espera de la denuncia*')
  //     }
  //   }
])

async function handleDiagramaPam ({ tarea }) {
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
</script>
<style scoped>
.p-submenu-header {
  display: none !important;
}
</style>
