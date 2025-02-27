<template>
<section>
  <AppDataTable
    id="tabla-bandeja-fiscal"
    v-bind="$attrs"
    ref="dt"
    class="mt-5"
    filter-display="menu"
    responsive-layout="scroll"
  >
    <Column v-if="$hasSomeRoles(funcionarioOfPartes)">
      <template #body="{ data }">
        <input
          :id="data?.tarea?.id"
          v-model="diligenciasSeleccionadas"
          class="p-checkbox"
          type="checkbox"
          :value="data"
        >
      </template>
    </Column>
    <Column
      v-if="$hasSomeRoles(fiscalJefe) || $hasSomeRoles(fiscal)"
      header="Ver Más"
    >
      <template #body="{ data }">
        <Button
          class="btn-primary p-button-rounded"
          icon="pi pi-plus-circle"
          @click="openModalVerMas(data)"
        />
      </template>
    </Column>
    <Column
      field="prioridad"
      header="Prioritario"
    >
      <template #body="{ data }">
        <Button
          class="p-button-rounded p-button-outlined"
          :class="prioritarioStyle(data?.prioritario)"
          icon="pi pi-flag-fill"
        />
      </template>
    </Column>
    <Column
      field="nombreTarea"
      header="Nombre Tarea"
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline"
          :label="data?.tarea?.taskName || data?.nombreTarea"
          @click="ejecutarTarea(data)"
        />
      </template>
    </Column>
    <Column
      field="ruc"
      header="RUC"
    >
      <template #body="{ data }">
        {{ data?.data?.ruc || 'N/A' }}
      </template>
    </Column>
    <Column
      field="alerta"
      header="Alerta"
    >
      <template #body="{ data }">
        {{ data.data?.alerta || 'N/A' }}
      </template>
    </Column>
    <Column
      field="causaJudicializada"
      header="Causa Judicializada"
    >
      <template #body="{ data }">
        {{ data.data?.causaJudicializada || 'N/A' }}
      </template>
    </Column>

    <Column
      field="imputado"
      header="Imputado"
    >
      <template #body="{ data }">
        {{ data.data?.imputado || 'N/A' }}
      </template>
    </Column>
    <Column
      field="victima"
      header="Víctima"
    >
      <template #body="{ data }">
        {{ data?.data?.victima || 'N/A' }}
      </template>
    </Column>
    <Column
      field="delito"
      header="Delito"
    >
      <template #body="{ data }">
        {{ data?.data?.delito || 'N/A' }}
      </template>
    </Column>
    <Column
      field="fechaCreacion"
      header="Fecha/Hora Creación"
    >
      <template #body="{ data }">
        {{ formatDate(data?.tarea?.taskCreatedOnDate) }}
      </template>
    </Column>
    <Column
      class="text-center"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="tareaseleccionada"
          :menu-options="accionesBandejaFiscal"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
// COMPONENTS
import { useRouter } from 'vue-router'
import { defineEmits } from '@/modules/common/types'

// UTILS
import { dateTimeUtil } from '@/utils'
import { computed, ref } from 'vue'

// COMPONSABLES
import { useAppDialog, useAppGlobalProperties } from '@/modules/common/composables'
import { useSessionStore } from '@/modules/session/composables'
const router = useRouter()
const { $hasSomeRoles } = useAppGlobalProperties()
const { perfiles } = useSessionStore()
const { launchDialog } = useAppDialog()

// VALUES
const emit = defineEmits(['tasking', 'send-to'])
const fiscalJefe = computed(() => perfiles?.value[1]?.fiscal_jefe)
const fiscal = computed(() => perfiles?.value[7]?.fiscal)
const funcionarioOfPartes = computed(() => perfiles?.value[2]?.funcionario_oficina_partes)
const tareaseleccionada = ref({})

// LOGIC
function prioritarioStyle (value) {
  return value ? 'p-button-secondary' : 'p-button-warning'
}
function openModalVerMas (tarea) {
  launchDialog({
    // component: ,
    header: 'Más Información de',
    width: '30%',
    props: { tarea }
  })
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

function ejecutarTarea (data) {
  if (data.tarea.taskName === 'Analizar Actualización Documento') {
    emit('send-to', { name: 'CddSolicitudActualizacion' }, data)
  } else if (data.tarea.taskName === 'Revisión de Solicitud de Almacenamiento Físico') {
    emit('send-to', { name: 'CddSolicitudAlmacenamiento' }, data)
  } else if (data.tarea.taskName === 'Analizar solicitud de recuperación de documento físico') {
    emit('send-to', { name: 'CddAnalizarSolicitudRecuperacionDocumentoFisico' }, data)
  } else if (data.tarea.taskName === 'Revision de Solicitud de Eliminación de Documento Físico') {
    emit('send-to', { name: 'CddRevisionSolicitudEliminacion' }, data)
  } else if (data.tarea.taskName === 'Ingreso de documento oficina de partes') {
    emit('send-to', { name: 'CddingresoNuevoDocumentoOficinaPartes' }, data)
  } else if (data.tarea.taskName === 'Registro de ingreso de documento físico a bodega') {
    emit('send-to', { name: 'CddIngresoDocumentoBodega' }, data)
  } else if (data.tarea.taskName === 'Registro de ingreso de documento físico a bodega temporal') {
    emit('send-to', { name: 'CddIngresoBodegaTemporal' }, data)
  } else if (data.tarea.taskName === 'Revisión solicitud de recuperación de documento físico') {
    emit('send-to', { name: 'CddRevisionSolicitudRecuperacionDocumentoFisico' }, data)
    router.push({ name: 'CddRevisionSolicitudRecuperacionDocumentoFisico' })
  } else if (data.tarea.taskName === 'Registrar salida documento') {
    emit('send-to', { name: 'CddRegistroSalidaDocumentoFisico' }, data)
  } else if (data.tarea.taskName === 'Agendamiento para devolución de documento físico') {
    emit('send-to', { name: 'CddAgendamientoDevolucionDocumento' }, data)
  } else if (data.tarea.taskName === 'Registro de eliminación de documento físico - Destrucción') {
    emit('send-to', { name: 'CddREDDatosEliminacion' }, data)
  } else if (data.nombreTarea === 'Registro de eliminación de documento físico - Devolución') {
    router.push('registro-devolucion-documento')
  }
}

const accionesBandejaFiscal = ref([
  {
    label: 'Acciones ',
    items: [
      {
        label: 'Ejecutar Tarea',
        command: () => {}
      },
      {
        label: 'Ver Procesos',
        command: () => {}
      },
      {
        label: 'Ver Relaciones',
        command: () => {}
      }
    ]
  }
])
</script>
