<template>
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
        @click="openMasInfoTarea(data?.data?.causa)"
      />
    </template>
  </Column>
  <Column
    v-if="selectable"
    header-style="width: 3em"
    selection-mode="multiple"
  />
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
        :label="data?.tarea?.taskName"
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
      Término / Postermino
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
    <template #body>
      <!--  -->
    </template>
  </Column>
  <Column
    class="text-center"
    field="judicializada"
    filter-field="judicializada"
    header="Causa Judicializada"
  >
    <template #body="{ data }">
      {{ data.judicializada ? 'Si' : 'No' }}
    </template>
  </Column>
  <Column
    class="text-center"
    field="delito"
    filter-field="delito"
    header="Delito"
  >
    <template
      #body="{
        data: {
          data: { causa }
        }
      }"
    >
      <div v-if="causa?.delitos?.length">
        {{ mantenedor_getNombreTipoDelito(causa?.delitos[0].tipoDelito) }}
      </div>
      <div v-else>
        N/A
      </div>
    </template>
  </Column>
  <Column
    class="text-center"
    field="delito"
    filter-field="delito"
    header="Víctimas"
  >
    <template
      #body="{
        data: {
          data: { causa }
        }
      }"
    >
      <div v-if="causa?.victimas?.length">
        {{ causa?.victimas[0]?.nombre }}
      </div>
      <div v-else>
        N/A
      </div>
    </template>
  </Column>
  <Column
    class="text-center"
    field="ultimaActividad"
    filter-field="ultimaActividad"
    header="Días desde última Actividad"
  >
    <template #body>
      <!--  -->
    </template>
  </Column>
  <Column
    class="text-center"
    field="fechaUltimaActividad"
    filter-field="fechaUltimaActividad"
    header="Fecha/Hora última Actividad"
  >
    <template #body>
      <!--  -->
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
</template>

<script setup>
import ModalVerMasCausa from '@/modules/dirigir-investigacion/components/modals/ModalVerMasCausa.vue'
import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import { useAppDialog } from '@/modules/common/composables'
import { requestUtil } from '@/utils'
import { useMantenedorStore, usePamStore } from '@/modules/global/composables'
import ModalRelaciones from '../modals/ModalRelaciones.vue'

defineProps({
  noColumnMasInfo: Boolean,
  selectable: Boolean
})

const { mantenedor_getNombreTipoDelito, mantenedor_getTiposDelito } =
  useMantenedorStore()

const { launchDialog } = useAppDialog()

const emit = defineEmits(['iniciar:tarea', 'aceptar-propuesta'])

const { pam_getDiagramaProcesoPrincipal, pam_getDiagramaProcesoActual } =
  usePamStore()

const causaSeleccionada = ref()

function sendToTarea (tarea) {
  emit('iniciar:tarea', tarea)
}

function setCausaPrioritaria (causa) {
  console.log(causa)
}

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

const mostrarRelacionesModal = (causa) => {
  const {
    data: {
      causa: { idDenuncia }
    }
  } = causa
  launchDialog({
    component: ModalRelaciones,
    width: '90%',
    header: 'Ver Relaciones',
    props: {
      idDenuncia
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
      mostrarRelacionesModal(causaSeleccionada.value)
    }
  },
  {
    label: 'Aceptar Propuesta',
    command: () => emit('aceptar-propuesta', causaSeleccionada.value)
  }
])

function prioritarioStyle (value) {
  return value ? 'p-button-secondary' : 'p-button-warning'
}

onMounted(() => {
  requestUtil({ action: mantenedor_getTiposDelito })
})
</script>
