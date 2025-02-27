<template>
<AppFieldset
  legend="Especies/Dinero"
>
  <AppDataTable
    id="dataTableEspecies"
    v-model:first="firstRecord"
    v-model:selection="especieSeleccionada"
    class="w-full"
    :loading="loader"
    responsive-layout="scroll"
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="especies"
    @page="getEspecies"
  >
    <Column
      class="text-center"
      header-style="width: 3em"
      selection-mode="multiple"
    />
    <Column header="Familia Especie">
      <template #body="{ data }">
        {{ mantenedor_getNombreFamiliaEspecie(data?.familiaEspecie) ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Tipo Especie">
      <template #body="{ data }">
        {{ mantenedor_getNombreTipoEspecie(data?.idTipoEspecie) ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Descripción">
      <template #body="{ data }">
        {{ data?.descripcion ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Estado de la Especie">
      <template #body="{ data }">
        {{ data?.estadoEspecie ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Observaciones">
      <template #body="{ data }">
        {{ data?.observacion ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Cantidad">
      <template #body="{ data }">
        {{ data?.cantidadEspecie ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Ubicación">
      <template #body="{ data }">
        {{ data?.ubicación ?? 'N/A' }}
      </template>
    </Column>
    <Column
      v-if="!isEditando && !readOnly"
      class="text-center"
      header="Acciones"
      style="width:0"
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
import { ref, onMounted } from 'vue'
import SolicitarSalidaAudiencia from '@/modules/gestion-solicitudes/components/modals/SolicitarSalidaAudiencia.vue'
import Peritaje from '@/modules/gestion-solicitudes/components/modals/Peritaje.vue'

import { requestUtil } from '@/utils'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { useEspeciesDineroStore, useMantenedorStore } from '@/modules/global/composables'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables'

const { idDenuncia } = useGestionSolicitudesStore()
const { toastError } = useAppToast()
const { launchDialog } = useAppDialog()

const { especies, especiesDinero_getEspecieByIdDenuncia } = useEspeciesDineroStore()
const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie,
  mantenedor_getFamiliaEspecies
} = useMantenedorStore()

const loader = ref(false)
const firstRecord = ref(0)
const especieSeleccionada = ref([])

onMounted(() => {
  getMantenedor()
  getEspecies()
})

function getMantenedor () {
  requestUtil({ action: mantenedor_getAllTiposEspecie })
  requestUtil({ action: mantenedor_getFamiliaEspecies })
}
async function getEspecies (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => { loader.value = l },
    reject: () => toastError('Ocurrió un error inesperado al cargar la tabla de Especies/Dinero')

  })
}

function openModalSolicitarSalida () {
  launchDialog({
    component: SolicitarSalidaAudiencia,
    header: 'Solicitar Salida Audiencia',
    width: '60%',
    cancelLabel: 'Cancelar',
    confirmLabel: 'Solicitar Salida'
  })
}

function openModalPeritaje () {
  launchDialog({
    component: Peritaje,
    header: 'Peritaje',
    width: '60%',
    cancelLabel: 'Cancelar',
    confirmLabel: 'Solicitar Salida'
  })
}

const opciones = ref([
  {
    label: 'Solicitar Salida Temporal',
    items: [
      {
        label: 'Solicitar Salida Audiencia',
        command: () => openModalSolicitarSalida()
      },
      {
        label: 'Peritaje',
        command: () => openModalPeritaje()
      }
    ]
  }
])
</script>
