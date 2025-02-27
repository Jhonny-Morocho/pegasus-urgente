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
          :class="prioritarioStyle(data?.tarea.taskPriority)"
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
          :label="data.tarea.taskName"
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
      <template #body="{ data }">
        {{ data?.data?.causa?.actividad || 'N/A' }}
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
          :label="data?.data?.causa.ruc || 'No disponible'"
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
        {{ data?.data?.causa?.alerta || 'N/A' }}
      </template>
    </Column>
    <Column
      class="text-left"
      field="judicializada"
      filter-field="judicializada"
      header="Causa Judicializada"
    >
      <template #body="{ data }">
        {{ data.data?.causa?.causaJudicializada }}
      </template>
    </Column>
    <Column
      class="text-left"
      field="imputado"
      filter-field="imputado"
      header="Imputado"
    >
      <template #body="{ data }">
        <section v-if="data?.data?.causa?.imputados?.length > 0">
          {{ `${data?.data?.causa?.imputados[0]?.nombre} ${data?.data?.causa?.imputados[0]?.apellido}` }}
        </section>
        <section v-else>
          N/A
        </section>
      </template>
    </Column>
    <Column
      class="text-left"
      field="delito"
      filter-field="delito"
      header="Delito"
    >
      <template #body="{ data }">
        <section>
          {{ mantenedor_getNombreTipoDelito(data.data?.causa?.delitos[0]?.tipoDelito) || data.data?.causa?.delitos[0]?.hechoDelictual || 'N/A' }}
        </section>
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
          {{ `${data?.data?.causa?.victimas[0]?.nombre} ${data?.data?.causa?.victimas[0]?.apellido}` }}
        </section>
        <section v-else>
          N/A
        </section>
      </template>
    </Column>

    <Column
      class="text-center"
      field="diasUltimaActividad"
      filter-field="diasUltimaActividad"
      header="Días desde última Actividad"
    >
      <template #body="{ data }">
        {{ data?.data?.causa?.diasUltimaActividad || 'N/A' }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="fechaUltimaActividad"
      filter-field="fechaUltimaActividad"
      header="Fecha/Hora última Actividad"
    >
      <template #body="{ data }">
        {{ data?.data?.causa?.fechaUltimaActividad || 'N/A' }}
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
import { ref, defineProps, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppDialog } from '@/modules/common/composables'
import { requestUtil } from '@/utils'
import { usePamStore, useMantenedorStore } from '@/modules/global/composables'
import ModalVerMasCausa from '@/modules/dirigir-investigacion/components/modals/ModalVerMasCausa.vue'
import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'

const { launchDialog } = useAppDialog()

defineProps({
  noColumnMasInfo: {
    type: Boolean,
    default: () => false
  }
})

const router = useRouter()

const causaSeleccionada = ref()

const { mantenedor_getTiposDelito, mantenedor_getNombreTipoDelito } = useMantenedorStore()

onMounted(() => {
  mantenedor_getTiposDelito()
})

const {
  pam_getDiagramaProcesoPrincipal,
  pam_getDiagramaProcesoActual
} = usePamStore()

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

function sendToTarea (causa) {
  if (causa?.procesoPam?.taskName === 'Revisar Antecedentes de la Causa') {
    router.push({ name: 'EJAntecedentesCausa' })
  }

  if (causa?.procesoPam?.taskName === 'Resolver Solicitud (Otra Fiscalía)') {
    router.push({ name: 'EJAntecedentesCausa' })
  }

  if (causa?.procesoPam?.taskName === 'Resolver Solicitud (Misma Fiscalía)') {
    router.push({ name: 'EJAntecedentesCausa' })
  }

  if (causa?.procesoPam?.taskName === 'Gestionar Previo Resolver') {
    router.push({ name: 'EJAntecedentesCausa' })
  }
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
      console.log(causaSeleccionada.value)
    },
    disabled: true
  }
])
</script>
