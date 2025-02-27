<template>
<AppDataTable
  id="dataTableMediosTransporte"
  :value="mediosTransporte"
>
  <Column header="Tipo Medio de Transporte">
    <template #body="slotProps">
      {{ slotProps.data.tipoMedioTransporteImputado }}
    </template>
  </Column>
  <Column header="Huida/Llegada/Ambos">
    <template #body="slotProps">
      {{ slotProps.data.ruta }}
    </template>
  </Column>
  <Column header="Detalle">
    <template #body="slotProps">
      {{ slotProps.data.detalleMedioTransporte }}
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="slotProps">
      <Button
        class="p-button-rounded p-button-warning p-button-outlined mr-2"
        icon="pi pi-pencil"
        @click="handleEditarMedioTransporte(slotProps.data)"
      />
      <Button
        class="p-button-rounded p-button-outlined p-button-danger"
        icon="pi pi-trash"
        @click="handleEliminarMedioTransporte(slotProps.data)"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { defineEmits } from 'vue'

import { useAppToast } from '@/modules/common/composables'

import { useConfirmDialog } from '@/modules/common/composables/useConfirmDialog'
import { useDelitoStore } from '../../composables'

const { toastSuccess } = useAppToast()

const emit = defineEmits(['medio-transporte:rellenar'])

const { launchConfirmDialog } = useConfirmDialog()

const { delito_DELETE_MEDIO_TRANSPORTE, mediosTransporte } = useDelitoStore()
function handleEditarMedioTransporte (medioTransporte) {
  emit('medio-transporte:rellenar', { medioTransporte })
}

function handleEliminarMedioTransporte (medioTransporte) {
  launchConfirmDialog({
    message: `¿Está seguro de eliminar el medio de transporte? ${medioTransporte.tipoMedioTransporteImputado} ${medioTransporte.ruta} ${medioTransporte.detalle}`,
    accept: () => {
      delito_DELETE_MEDIO_TRANSPORTE(medioTransporte)
      toastSuccess('El Medio de transporte ha sido eliminado')
    }
  })
}
</script>
