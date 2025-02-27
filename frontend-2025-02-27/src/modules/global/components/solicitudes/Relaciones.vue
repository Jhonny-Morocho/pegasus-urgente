<template>
<AppFieldset legend="Relaciones">
  <AppDataTable
    id="dataTableDocumentos"
    v-model:first="firstRecord"
    v-model:selection="seleccionadas"
    class="w-full"
    :loading="loader"
    responsive-layout="scroll"
    :total-records="relaciones.length"
    :value="relaciones"
    @page="getRelaciones"
  >
    <Column
      class="text-center"
      header-style="width: 3em"
      selection-mode="multiple"
    />
    <Column header="Victima">
      <template #body="{ data }">
        {{ data?.nombreCompletoVictima ?? "N/A" }}
      </template>
    </Column>
    <Column header="Imputado">
      <template #body="{ data }">
        {{ data?.nombreCompletoImputado ?? "N/A" }}
      </template>
    </Column>
    <Column header="Delito">
      <template #body="{ data }">
        {{ data?.nombreDelito ?? "N/A" }}
      </template>
    </Column>
    <Column header="Estado de la Relación">
      <template #body="{ data }">
        {{
          mantenedor_getDescripcionEstadoRelacionById(
            data?.idEstadoRelacion
          ) ?? "N/A"
        }}
      </template>
    </Column>
    <Column header="Etapa de la Relación">
      <template #body="{ data }">
        {{ data?.etapaRelacion ?? "Sin Información" }}
      </template>
    </Column>
    <Column header="Derivado a URAVIT">
      <template #body="{ data }">
        {{ data?.uravit ?? "NO" }}
      </template>
    </Column>
    <Column
      class="text-center"
      header="Acciones"
      style="width: 0"
    >
      <template #body="slotProps">
        <AppMenuOptions
          :menu-options="opciones"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</AppFieldset>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'

import Uravit from '@/modules/gestion-solicitudes/components/modals/Uravit.vue'

import {
  useMantenedorStore,
  useRelacionesStore
} from '@/modules/global/composables'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { requestUtil } from '@/utils'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'

const { toastError } = useAppToast()
const { launchDialog } = useAppDialog()

const { relaciones_getRelaciones, relaciones } = useRelacionesStore()

const {
  mantenedor_getDescripcionEstadoRelacionById,
  mantenedor_getAllEstadoRelacion
} = useMantenedorStore()

const {
  relacionesSeleccionadas,
  idDenuncia,
  solicitudes_SET_RELACIONES_SELECCIONADAS
} = useSolicitudesStore()

const loader = ref(false)
const firstRecord = ref(0)
const seleccionadas = ref([])

onMounted(async () => {
  getMantenedor()
  getRelaciones()

  if (relacionesSeleccionadas.value.length) {
    seleccionadas.value = relacionesSeleccionadas.value
  }
})

function getMantenedor () {
  requestUtil({ action: mantenedor_getAllEstadoRelacion })
}

watch(seleccionadas, (val) => {
  solicitudes_SET_RELACIONES_SELECCIONADAS(val)
})

async function getRelaciones (pagination = undefined) {
  loader.value = true
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  await requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => {
      loader.value = l
    },
    resolve: () => {
      if (relaciones.value.length === 1) {
        seleccionadas.value = relaciones.value
      }
    },
    reject: () =>
      toastError(
        'Ocurrió un error inesperado al cargar la tabla de relaciones'
      )
  })
}

function openModal () {
  launchDialog({
    component: Uravit,
    header: 'Derivar a URAVIT',
    width: '50%',
    cancelLabel: 'Cancelar',
    confirmLabel: 'Enviar a URAVIT'
  })
}

const opciones = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Derivar a URAVIT',
        command: () => openModal()
      }
    ]
  }
])
</script>
