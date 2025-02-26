<template>
<AppDataTable
  id="tablaImagenes"
  class="col-12"
  :value="imagenes"
>
  <Column header="Nombre del archivo">
    <template #body="{data}">
      <span v-if="data.nombreArchivo">
        {{ data.nombreArchivo }}
      </span>
      <span v-else>Sin nombre</span>
    </template>
  </Column>
  <Column header="Tipo de archivo">
    <template #body="{ data }">
      <span v-if="data.tipoArchivo">
        {{ data.tipoArchivo }}
      </span>
      <span v-else>Sin descripción</span>
    </template>
  </Column>
  <Column header="Tamaño">
    <template #body="{ data }">
      <span v-if="data.tamanoArchivo">
        {{ data.tamanoArchivo }}
      </span>
      <span v-else>Sin descripción</span>
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="{ data }">
      <div class="flex">
        <span>
          <Button
            class="p-button-rounded p-button-outlined p-button-danger mr-2"
            icon="pi pi-trash"
            @click="openEliminar(data)"
          />
        </span>
      </div>
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { useLevantamientoCadenaCustodio } from '../../composables/useLevantamientoCadenaCustodio'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'

const { toastWarning } = useAppToast()
const { imagenes, levantamientoCadenaCustodio_DELETE_IMAGEN } = useLevantamientoCadenaCustodio()

const { launchConfirmDialog } = useConfirmDialog()

const openEliminar = (archivo) => {
  const { nombreArchivo, idArchivo } = archivo
  launchConfirmDialog({
    message: `¿Estás seguro de eliminar el archivo ${nombreArchivo}?`,
    accept: () => {
      levantamientoCadenaCustodio_DELETE_IMAGEN(idArchivo)
      toastWarning('Documento Eliminado')
    }
  })
}
</script>
