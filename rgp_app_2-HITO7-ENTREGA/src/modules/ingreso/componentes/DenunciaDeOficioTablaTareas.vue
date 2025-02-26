<template>
<section>
  <AppDataTable
    id="dataTableDenuncias"
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
          @click="openModalMasInfoDenuncia(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      header="Aceptar"
    >
      <template #body="{ data }">
        <input
          :id="data.id"
          v-model="diligenciasSeleccionadas"
          class="p-checkbox"
          type="checkbox"
          :value="diligenciasSeleccionadas"
        >
      </template>
    </Column>
    <Column
      class="text-center"
      field="prioritario"
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
          @click="sendToCausa(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="data.denuncia.ruc"
      filter-field="data.denuncia.ruc"
      header="RUC"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ data?.data?.denuncia?.ruc ? data?.data?.denuncia?.ruc : 'N/A' }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="data.origenDenuncia"
      filter-field="data.origenDenuncia"
      header="Origen Denuncia"
      :sortable="true"
    >
      <template #body="{ data }">
        <p v-if="data.origenDenuncia == '1'">
          Carabineros
        </p>
        <p v-if="data.origenDenuncia === '2'">
          PDI
        </p>
        <p v-if="data.origenDenuncia === null">
          Otros
        </p>
        <p v-else>
          N/A
        </p>
      </template>
    </Column>
    <Column
      class="text-center"
      field="tarea.taskCreatedOnDate"
      filter-field="tarea.taskCreatedOnDate"
      header="Fecha/Hora Creación Causa"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ dateTimeUtil.formatToFrontendWithTime(data.tarea.taskCreatedOnDate) }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="data.denuncia.delitos"
      filter-field="data.denuncia.delitos"
      header="Delito"
      :sortable="true"
    >
      <template #body="{ data }">
        <p>
          {{ data.data?.denuncia?.delitos ? mantenedor_getNombreTipoDelito(data.data?.denuncia?.delitos[0]?.tipoDelito) : 'N/A' }}
        </p>
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
        <p
          v-if="data.alerta"
          class="font-bold"
        >
          {{ data.alerta }}
        </p>
        <p v-else>
          N/A
        </p>
      </template>
    </Column>

    <Column
      class="text-center"
      field="nombrePreclasificador"
      filter-field="nombrePreclasificador"
      header="Preclasificador"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ data.nombrePreclasificador ? data.nombrePreclasificador : 'Sin Preclasificador' }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="estadoTarea"
      filter-field="estadoTarea"
      header="Propuesta"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ data?.estadoTarea ? data?.estadoTarea : 'Sin Propuesta' }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="nombreFiscalPropuesto"
      filter-field="nombreFiscalPropuesto"
      header="Fiscal Propuesto"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ data.nombreFiscalPropuesto ? data.nombreFiscalPropuesto : 'Sin Fiscal Propuesto' }}
      </template>
    </Column>
    <Column
      class="text-center"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="dataCausaSeleccionada"
          :menu-options="accionesBandejaIngreso"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

import { useAppDialog, useAppToast } from '@/modules/common/composables'
import ModalMasInfoDenuncia from '../componentes/bandeja/modals/ModalMasInfoDenuncia.vue'
import { useDelitoStore, useMantenedorStore, useDocumentoStore, useEspeciesDineroStore, usePamStore, useRelacionesStore, useRelatoStore, useSujetosIntervinientesStore, useFichaCausaStore } from '@/modules/global/composables'
import { useCrearCausaStore, useIdentificacionDenunciaStore, useBandejaAtendedorJuridico } from '@/modules/ingreso/composables'

import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'

import { requestUtil, dateTimeUtil } from '@/utils'

const { launchDialog } = useAppDialog()

const { bandejaAtendedorJuridico_setPrioritario } = useBandejaAtendedorJuridico()

const { mantenedor_getNombreTipoDelito } = useMantenedorStore()
const { identificacionDenuncia_getTipoDenuncia } = useIdentificacionDenunciaStore()
const { pam_getDiagramaProcesoPrincipal, pam_getDiagramaProcesoActual, pam_SET_PROCESO } = usePamStore()

const { toastSuccess, toastWarning } = useAppToast()

const { crearCausa_SET_TIPO_DENUNCIA } = useCrearCausaStore()
const { fichaCausa_SET_CAUSA } = useFichaCausaStore()
const { fichaCausa_getCausa } = useFichaCausaStore()

const router = useRouter()

const { identificacionDenuncia_SET_DEFAULT_STATE } = useIdentificacionDenunciaStore()

const { sujetosIntervinientes_SET_DEFAULT_STATE } = useSujetosIntervinientesStore()
const { delito_SET_DEFAULT_STATE } = useDelitoStore()
const { relaciones_SET_DEFAULT_STATE } = useRelacionesStore()
const { especiesDinero_SET_DEFAULT_STATE } = useEspeciesDineroStore()
const { relato_SET_DEFAULT_STATE } = useRelatoStore()
const { documento_SET_DEFAULT_STATE } = useDocumentoStore()

const emit = defineEmits(['tasking'])

const diligenciasSeleccionadas = ref([])

function openModalMasInfoDenuncia (denuncia) {
  launchDialog({
    component: ModalMasInfoDenuncia,
    header: 'Más Información de la Causa',
    width: '30%',
    props: { denuncia }
  })
}

function prioritarioStyle (value) {
  return value ? 'p-button-secondary' : 'p-button-warning'
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

const accionesBandejaIngreso = ref([
  {
    label: 'Acciones para la tarea',
    items: [
      {
        label: 'Ejecutar Tarea',
        command: () => {
          sendToCausa(dataCausaSeleccionada.value)
        }
      },
      {
        label: 'Ver Proceso',
        command: () => handleDiagramaPam(dataCausaSeleccionada.value)
      },
      {
        label: 'Aceptar Propuesta',
        disabled: true,
        command: () => {
          console.log('*Se Acepta La Propuesta')
        }
      }
    ]
  }
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

function limpiarStore () {
  identificacionDenuncia_SET_DEFAULT_STATE()
  sujetosIntervinientes_SET_DEFAULT_STATE()
  delito_SET_DEFAULT_STATE()
  relaciones_SET_DEFAULT_STATE()
  especiesDinero_SET_DEFAULT_STATE()
  relato_SET_DEFAULT_STATE()
  documento_SET_DEFAULT_STATE()
}
function sendToCausa (data) {
  emit('tasking', true)
  console.log('Denuncia Seleccionada: ', data)
  limpiarStore()
  crearCausa_SET_TIPO_DENUNCIA('Oficio')
  identificacionDenuncia_getTipoDenuncia('3')
  pam_SET_PROCESO({ ...data.tarea, idDenuncia: data.data.denuncia.idDenuncia })
  requestUtil({
    action: fichaCausa_getCausa,
    payload: data?.data.denuncia,
    resolve: () => {
      fichaCausa_SET_CAUSA(data)
      router.push('/ingreso/denuncia-oficio/nueva-denuncia/identificacion-denuncia')
    },
    loader: (l) => {
      emit('tasking', l)
    }
  })
}

// opciones de acciones de menu de Procedimientos
const dataCausaSeleccionada = ref()
</script>

<style scoped>
.p-submenu-header {
  display: none !important;
}
</style>
