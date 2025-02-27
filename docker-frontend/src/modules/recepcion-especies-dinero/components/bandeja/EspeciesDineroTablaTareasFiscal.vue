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
      field="verMas"
      filter-field="verMas"
      header="Ver Mas"
      :sortable="true"
    >
      <template #body="slotProps">
        {{ slotProps.data?.verMas }}
      </template>
    </Column>
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
      field="alerta"
      filter-field="alerta"
      header="Alerta"
      :sortable="true"
    >
      <template #body="slotProps">
        {{ slotProps.data?.alerta }}
      </template>
    </Column>
    <Column
      field="causaJudicializada"
      filter-field="causaJudicializada"
      header="Causa Judicializada"
      :sortable="true"
    >
      <template #body="slotProps">
        {{ slotProps.data?.causaJudicializada }}
      </template>
    </Column>
    <Column
      field="delito"
      filter-field="delito"
      header="Delito"
      :sortable="true"
    >
      <template #body="slotProps">
        {{ slotProps.data?.delito }}
      </template>
    </Column>
    <Column
      field="responsableDeMaterializar"
      filter-field="responsableDeMaterializar"
      header="Responsable de materializar"
      :sortable="true"
    >
      <template #body="slotProps">
        {{ slotProps.data?.responsableDeMaterializar }}
      </template>
    </Column>
    <Column
      field="institucionEjecutora"
      filter-field="institucionEjecutora"
      header="Institución Ejecutora"
      :sortable="true"
    >
      <template #body="slotProps">
        {{ slotProps.data?.institucionEjecutora }}
      </template>
    </Column>
    <Column
      field="plazo"
      filter-field="plazo"
      header="Plazo"
      :sortable="true"
    >
      <template #body="slotProps">
        {{ slotProps.data?.plazo }}
      </template>
    </Column>
    <Column
      field="fechaHoraAsignacion"
      filter-field="fechaHoraAsignacion"
      header="Fecha/Hora Asignación"
      :sortable="true"
    >
      <template #body="slotProps">
        {{ formatFecha(slotProps.data.fechaHoraAsignacion) }}
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
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { dateTimeUtil, requestUtil } from '@/utils'
import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'
import { usePamStore } from '@/modules/global/composables'

import { useRouter } from 'vue-router'
import { useBandejaCustodioStore, useEspecieIncautadaPendienteRecepcionStore } from '@/modules/recepcion-especies-dinero/composables/'
// UTILITIES
const { launchDialog } = useAppDialog()
const {
  pam_getDiagramaProcesoPrincipal,
  pam_getDiagramaProcesoActual
} = usePamStore()
const router = useRouter()
const { bandejaCustodio_SET_ESPECIE_DINERO_SELECCIONADA } = useBandejaCustodioStore()
const { stepEspeciesIncautadasPendientesDeRecepcion_getEspecieDineroNoIngresado } = useEspecieIncautadaPendienteRecepcionStore()

// VALUES
const causaSeleccionada = ref(null)

const emit = defineEmits(['actualizar-prioridad', 'update:fechaDesde', 'update:fechaHasta', 'buscar-causa'])

const { toastError } = useAppToast()

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

function formatFecha (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

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
  if (data.nombreTarea.includes('Recepcionar')) {
    requestUtil({
      action: bandejaCustodio_SET_ESPECIE_DINERO_SELECCIONADA,
      payload: data,
      resolve: () => {
        router.push('/custodia/nueva-recepcion/identificacion-nue')
      }
    })
  } else if (data.nombreTarea.includes('Ingresar')) {
    requestUtil({
      action: stepEspeciesIncautadasPendientesDeRecepcion_getEspecieDineroNoIngresado,
      payload: { nue: data.nue },
      // payload: { nue: data.nue },
      resolve: () => {
        router.push('/custodia/nuevo-ingreso/ingresar-datos-adicionales')
      },
      reject: (err) => {
        const mensaje = err.response.data.message.replaceAll('_', ' ')
        toastError(mensaje.charAt(0).toUpperCase() + mensaje.slice(1))
      }
    })
  }
}

</script>
