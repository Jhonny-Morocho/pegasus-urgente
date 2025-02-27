<template>
<section>
  <AppDataTable
    id="tabla-custodio"
    v-bind="$attrs"
    ref="dt"
    class="mt-5 w-full"
    filter-display="menu"
    responsive-layout="scroll"
  >
    <Column
      field="prioritario"
      header="Prioritario"
      :sortable="true"
    >
      <template #body="slotProps">
        <Button
          :class="classEsPrioritario(slotProps.data.prioritario)"
          icon="pi pi-flag-fill"
          @click="setPrioritario(slotProps.data.idBandeja, slotProps.data.prioritario)"
        />
      </template>
    </Column>
    <Column
      field="nombreDeLaTarea"
      filter-field="nombreDeLaTarea"
      header="Actividad"
      :sortable="true"
    >
      <template #body="slotProps">
        <span>
          <Button
            class="p-button-text pl-0 ml-0 btn-primary-outline"
            :label="slotProps.data.nombreTarea"
            @click="sendToTarea(slotProps.data)"
          />

        </span>
      </template>
    </Column>
    <Column
      field="nue"
      filter-field="nue"
      header="NUE"
      :sortable="true"
    >
      <template #body="slotProps">
        {{ slotProps.data?.nue }}
      </template>
    </Column>
    <Column
      field="ruc"
      filter-field="ruc"
      header="RUC"
      :sortable="true"
    >
      <template #body="slotProps">
        {{ slotProps.data?.ruc }}
      </template>
    </Column>
    <Column
      field="estadoTarea"
      filter-field="estadoTarea"
      header="Estado"
      :sortable="true"
    >
      <template #body="{data}">
        {{ data?.tarea.taskStatus }}
      </template>
    </Column>
    <Column
      field="sla"
      filter-field="sla"
      header="SLA"
      :sortable="true"
    >
      <template #body="{data}">
        {{ data?.tarea?.sla }}
      </template>
    </Column>
    <Column
      field="marca"
      filter-field="marca"
      header="Marca"
      :sortable="true"
    >
      <template #body="{data}">
        {{ data.marca }}
      </template>
    </Column>
    <Column
      field="codigoFiscalia"
      filter-field="codigoFiscalia"
      header="Código Fiscalía"
      :sortable="true"
    >
      <template #body="{data}">
        {{ data.codigoFiscalia }}
      </template>
    </Column>
    <Column
      field="fechaHoraAsignacion"
      filter-field="fechaHoraAsignacion"
      header="Fecha/Hora Asignación"
      :sortable="true"
    >
      <template #body="{data}">
        {{ formatFecha(data.tarea.taskCreatedOnDate) }}
      </template>
    </Column>
    <Column
      v-if="false"
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
// IMPORT COMPONENTS AND FUNCTIONALITIES

import { ref, defineEmits, defineProps } from 'vue'
import { useAppDialog } from '@/modules/common/composables'
import { requestUtil } from '@/utils'
import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'
import { usePamStore } from '@/modules/global/composables'

import { useRouter } from 'vue-router'
import { useBandejaCustodioUAFStore } from '@/modules/recepcion-especies-dinero/composables/'
// UTILITIES
const { launchDialog } = useAppDialog()
const {
  pam_getDiagramaProcesoPrincipal,
  pam_getDiagramaProcesoActual
} = usePamStore()
const router = useRouter()
const { bandejaCustodio_SET_DATA_GENERAR_CHEQUE, bandejaCustodioUAF_SET_DATA_METODO_ENTREGA } = useBandejaCustodioUAFStore()

// VALUES
const causaSeleccionada = ref(null)

const emit = defineEmits(['actualizar-prioridad', 'update:fechaDesde', 'update:fechaHasta', 'buscar-causa'])

defineProps({
  isLoading: Boolean,
  fechaDesde: Date,
  fechaHasta: Date
})

// LOGIC

// Barra de busqueda

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

const opcionesBandeja = ref([
  {
    items: [
      {
        label: 'Ejecutar Tarea',
        command: () => {
          sendToTarea(causaSeleccionada.value)
        }
      },
      {
        label: 'Ver Proceso',
        command: () => {
          verProceso(causaSeleccionada.value)
        }
      }
    ]
  }
])

// Set prioritario
function classEsPrioritario (prioritario) {
  if (prioritario) {
    return 'p-button-rounded p-button-secondary  p-button-outlined'
  } else {
    return 'p-button-rounded p-button-warning p-button-outlined'
  }
}

function setPrioritario (idBandeja, esPrioritario) {
  const prioritario = !esPrioritario
  const dataTarea = { idBandeja, prioritario }
  emit('actualizar-prioridad', dataTarea)
}

function sendToTarea (data) {
  if (data.nombreTarea.includes('Generar cheque')) {
    requestUtil({
      action: bandejaCustodio_SET_DATA_GENERAR_CHEQUE,
      payload: data,
      resolve: (res) => {
        console.log('bandejaUAF', res)
        // router.push('/custodia/nueva-recepcion/identificacion-nue')
      }
    })
  } else if (data.nombreTarea.includes('Metodo entrega')) {
    requestUtil({
      action: bandejaCustodioUAF_SET_DATA_METODO_ENTREGA,
      payload: data,
      resolve: (res) => {
        console.log('bandejaUAF', res)
        router.push('/custodia/uaf/salida-transferencia-dinero-metodo-entrega')
      }
    })
  }
}

</script>
