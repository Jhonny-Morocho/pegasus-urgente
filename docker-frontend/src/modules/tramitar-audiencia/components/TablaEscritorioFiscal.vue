<template>
<section>
  <AppDataTable
    id="tabla-dirigir-investigacion"
    v-bind="$attrs"
    ref="dt"
    class="mt-5"
    filter-display="menu"
    responsive-layout="scroll"
  >
    <Column header="Ver más">
      <template #body="{ data }">
        <Button
          class="p-button-rounded p-button-outlined"
          :disabled="noColumnMasInfo"
          icon="pi pi-plus"
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
          icon="pi pi-flag-fill"
          @click="setCausaPrioritaria(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="nombreTarea"
      filter-field="nombreTarea"
      header="Nombre Tarea"
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline"
          :label="data?.procesoPam?.taskName ?? data['task-name']"
          @click="sendToTarea(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="actividad"
      filter-field="actividad"
      header="Actividad"
    >
      <template #body>
        Tramitar Audiencia
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
          :label="data?.ruc ?? data['task-input-data'].causa.ruc"
          @click="sendToTarea(data)"
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
        {{ data['task-input-data'].causa.alerta ?? 'N/A' }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="judicializada"
      filter-field="judicializada"
      header="Causa Judicializada"
    >
      <template #body="{ data }">
        {{ (data.judicializada ? 'Si' : data['task-input-data'].causa.causaJudicializada ?? 'No') }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="nombreImputado"
      filter-field="nombreImputado"
      header="Imputado"
    >
      <template #body="{ data }">
        {{ getArraysData(data['task-input-data'].causa.imputados) }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="delito"
      filter-field="delito"
      header="Delito"
    >
      <template #body="{ data }">
        {{ getArraysData(data['task-input-data'].causa.delitos) }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="victimas"
      filter-field="victimas"
      header="Víctimas"
    >
      <template #body="{ data }">
        {{ getArraysData(data['task-input-data'].causa.victimas) }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="fechaUltimaActividad"
      filter-field="fechaUltimaActividad"
      header="Fecha/Hora última Actividad"
    >
      <template #body="{ data }">
        {{ data['task-input-data'].causa.fechaUltimaActividad ? dateTimeUtil.formatToFrontendWithTime(data['task-input-data'].causa.fechaUltimaActividad) : 'N/A' }}
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
import ModalVerMasCausa from '@/modules/dirigir-investigacion/components/modals/ModalVerMasCausa.vue'
import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'
import { ref, defineProps, defineEmits } from 'vue'
import { useAppDialog } from '@/modules/common/composables'
import { requestUtil, dateTimeUtil } from '@/utils'
import { useMantenedorHelper, useMantenedorStore, usePamStore } from '@/modules/global/composables'

const { launchDialog } = useAppDialog()

const causaSeleccionada = ref()

defineProps({
  noColumnMasInfo: {
    type: Boolean,
    default: () => false
  }
})

const emit = defineEmits(['iniciar:tarea', 'send-to'])

const { pam_getDiagramaProcesoPrincipal, pam_getDiagramaProcesoActual } = usePamStore()

function openMasInfoTarea (causa) {
  console.log({ causa })
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

function sendToTarea (data) {
  console.log(data)
  emit('iniciar:tarea', data)

  if (data?.procesoPam?.taskName === 'Solicitar Audiencia') {
    emit('send-to', { name: 'RedirectSolicitarAudiencia' }, data)
  } else if (data?.procesoPam?.taskName === 'Evaluar Resolucion del Tribunal') {
    emit('send-to', { name: 'TAEvaluarResolucionTribunal' }, data)
  } else if (data?.procesoPam?.taskName === 'Actualizar Minuta' || data['task-name'] === 'Actualiza Minuta') {
    emit('send-to', { name: 'TAActualizarMinutaAudiencia' }, data)
  } else if (data?.procesoPam?.taskName === 'Gestionar Previo Resolver') {
    emit('send-to', { name: 'TAGestionarPrevioResolver' }, data)
  } else if (data?.procesoPam?.taskName === 'Nómina de Detenidos a ACD') {
    emit('send-to', { name: 'TANominaDetenidosACD' }, data)
  } else if (data?.procesoPam?.taskName === 'Revisar Minuta y agendamiento de audiencia') {
    emit('send-to', { name: 'TARevisarMinutaAgendarAudiencia' }, data)
  } else if (data?.procesoPam?.taskName === 'Vista de Audiencia') {
    emit('send-to', { name: 'TAVAMinutaAudiencia' }, data)
  } else if (data?.procesoPam?.taskName === 'Consolidar Resultado de Audiencia') {
    emit('send-to', { name: 'TAConsolidarResultadoAudiencia' }, data)
  }
}

function prioritarioStyle (value) {
  return value ? 'p-button-secondary' : 'p-button-warning'
}

// VA FUNCIONAR CUANDO TENGAN BANDEJA CON ENDPOINT
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
      console.log(causaSeleccionada.value)
    },
    disabled: true
  }
])

const { mantenedor_getTiposDelito, tiposDelito } = useMantenedorStore()

mantenedor_getTiposDelito()

const { getDescripcionMantenedorById } = useMantenedorHelper()

function getArraysData (data) {
  if (data.length > 0) {
    return data[0]?.hechoDelictual ?? getDescripcionMantenedorById(tiposDelito.value, data[0]?.tipoDelito) ?? data[0]?.nombre + ' ' + data[0]?.apellido
  } else {
    return 'N/A'
  }
}
</script>
