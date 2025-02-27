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
      <template #body="{data}">
        <Button
          :class="classEsPrioritario(data.prioritario)"
          icon="pi pi-flag-fill"
          @click="setPrioritario(data.idBandeja, data.prioritario)"
        />
      </template>
    </Column>
    <Column
      field="nombreDeLaTarea"
      filter-field="nombreDeLaTarea"
      header="Nombre de la Tarea"
      :sortable="true"
    >
      <template #body="{data}">
        <span>
          <Button
            class="p-button-text pl-0 ml-0 btn-primary-outline"
            :label="data.tarea.taskName"
            @click="sendToTarea(data)"
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
      <template #body="{data}">
        {{ data?.data.nue }}
      </template>
    </Column>
    <Column
      field="ruc"
      filter-field="ruc"
      header="RUC"
      :sortable="true"
    >
      <template #body="{data}">
        {{ data?.data.ruc }}
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

import { ref, defineEmits } from 'vue'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { dateTimeUtil, requestUtil } from '@/utils'
import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'
import { usePamStore } from '@/modules/global/composables'

import { useRouter } from 'vue-router'
import { useBandejaCustodioStore, useEspecieIncautadaPendienteRecepcionStore, useFijacionFotografica, useIngresoDinero, useRegistroSalida, useSalidaDinero } from '@/modules/recepcion-especies-dinero/composables/'
// UTILITIES
const { launchDialog } = useAppDialog()
const {
  pam_getDiagramaProcesoPrincipal,
  pam_getDiagramaProcesoActual
} = usePamStore()
const router = useRouter()
const { bandejaCustodio_SET_ESPECIE_DINERO_SELECCIONADA, bandejaCustodio_SET_FLUJO } = useBandejaCustodioStore()
const { stepEspeciesIncautadasPendientesDeRecepcion_getEspecieDineroNoIngresado } = useEspecieIncautadaPendienteRecepcionStore()
const { fijacionfotografica_getDataEspecieFijacion } = useFijacionFotografica()
const { stepIngresoDinero_getDataRevisarInstruccion, stepIngresoDinero_getDataCustodiaInspeccion } = useIngresoDinero()
const { registroSalida_getSolicitudSalida, registroSalida_registrarSalidaPorTransferenciaEspecie } = useRegistroSalida()
const { salidaDinero_dataRegistrarChequeRecibido, salidaDinero_dataRegistrarDeposito } = useSalidaDinero()
// VALUES
const causaSeleccionada = ref(null)

const emit = defineEmits(['actualizar-prioridad', 'update:fechaDesde', 'update:fechaHasta', 'buscar-causa'])

const { toastError } = useAppToast()

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
  bandejaCustodio_SET_FLUJO('separar')
  if (data.tarea.taskName.includes('antecedentes')) {
    requestUtil({
      action: bandejaCustodio_SET_ESPECIE_DINERO_SELECCIONADA,
      payload: data,
      resolve: () => {
        router.push({ name: 'IdentificacionNue' })
      }
    })
  } else if (data.tarea.taskName.includes('Ingresar Datos')) {
    requestUtil({
      action: stepEspeciesIncautadasPendientesDeRecepcion_getEspecieDineroNoIngresado,
      payload: { nue: data.data.nue },
      resolve: () => {
        router.push('/custodia/custodio/nuevo-ingreso/ingresar-datos-adicionales')
      },
      reject: (err) => {
        const mensaje = err.response.data.message.replaceAll('_', ' ')
        toastError(mensaje.charAt(0).toUpperCase() + mensaje.slice(1))
      }
    })
  } else if (data.tarea.taskName.includes('Revisar instrucción - Salida temporal')) {
    requestUtil({
      action: stepIngresoDinero_getDataRevisarInstruccion,
      payload: {
        data,
        salidaTemporal: true
      },
      resolve: () => {
        router.push('/custodia/custodio/revisar-instruccion/instruccion-de-destino')
      },
      reject: (err) => {
        const mensaje = err.response.data.message.replaceAll('_', ' ')
        toastError(mensaje.charAt(0).toUpperCase() + mensaje.slice(1))
      }
    })
  } else if (data.tarea.taskName.includes('Revisar Instruccion - Salida por transferencia')) {
    requestUtil({
      action: stepIngresoDinero_getDataRevisarInstruccion,
      payload: {
        data,
        salidaTransferencia: true
      },
      resolve: () => {
        router.push('/custodia/custodio/revisar-instruccion/instruccion-de-destino')
      },
      reject: (err) => {
        const mensaje = err.response.data.message.replaceAll('_', ' ')
        toastError(mensaje.charAt(0).toUpperCase() + mensaje.slice(1))
      }
    })
  } else if (data.tarea.taskName.includes('Inspección')) {
    requestUtil({
      action: stepIngresoDinero_getDataCustodiaInspeccion,
      payload: { data },
      resolve: () => {
        router.push('/custodia/custodio/registrar-inspeccion-visual/datos-inspeccion-visual')
      },
      reject: (err) => {
        const mensaje = err.response.data.message.replaceAll('_', ' ')
        toastError(mensaje.charAt(0).toUpperCase() + mensaje.slice(1))
      }
    })
  } else if (data.tarea.taskName.includes('Reubicacion')) {
    bandejaCustodio_SET_FLUJO('busqueda')
    router.push('/custodia/custodio/decidir-reubicacion/datos-causa-agrupar-principal')
  } else if (data.tarea.taskName.includes('Fijar')) {
    requestUtil({
      action: fijacionfotografica_getDataEspecieFijacion,
      payload: { rue: data.data.rue },
      // payload: { nue: data.nue },
      resolve: () => {
        router.push('/custodia/custodio/realizar-fijacion-fotografica')
      },
      reject: (err) => {
        const mensaje = err.response.data.message.replaceAll('_', ' ')
        toastError(mensaje.charAt(0).toUpperCase() + mensaje.slice(1))
      }
    })
  } else if (data.tarea.taskName.includes('Registrar salida temporal')) {
    requestUtil({
      action: registroSalida_getSolicitudSalida,
      payload: { data },
      // payload: { nue: data.nue },
      resolve: () => {
        router.push('/custodia/custodio/registrar-salida-temporal/registrar-salida-temporal-de-especie')
      },
      reject: (err) => {
        const mensaje = err.response.data.message.replaceAll('_', ' ')
        toastError(mensaje.charAt(0).toUpperCase() + mensaje.slice(1))
      }
    })
  } else if (data.tarea.taskName.includes('Registrar Cheque')) {
    requestUtil({
      action: salidaDinero_dataRegistrarChequeRecibido,
      payload: { data },
      resolve: () => {
        router.push('/custodia/custodio/registrar-cheque-recibido')
      }
    })
  } else if (data.tarea.taskName.includes('Registrar Deposito')) {
    requestUtil({
      action: salidaDinero_dataRegistrarDeposito,
      payload: { data },
      resolve: () => {
        router.push('/custodia/custodio/especie-dinero/registrar-deposito')
      }
    })
  } else if (data.tarea.taskName.includes('transferencia')) {
    requestUtil({
      action: registroSalida_registrarSalidaPorTransferenciaEspecie,
      payload: { data },
      resolve: () => {
        router.push('/custodia/custodio/salida-por-transferencia-de-especies/revisar-solicitud-salida-transferencia')
      }
    })
  }
}

</script>
