<template>
<AppDataTable
  id="tabla-documentos"
  v-bind="$attrs"
  class="col-12"
>
  <Column
    v-if="selectable"
    selection-mode="multiple"
  />
  <Column header="Nombre del Archivo">
    <template #body="{ data }">
      {{ data?.nombreArchivo || data?.nombre }}
    </template>
  </Column>
  <Column header="Descripción del Archivo">
    <template #body="{ data }">
      {{ data?.descripcionArchivo || data?.descripcion }}
    </template>
  </Column>
  <Column
    v-if="dirigeInvestigacion"
    header="Fecha Creación"
  >
    <template #body="{ data }">
      {{ data?.fechaCreacion }}
    </template>
  </Column>
  <Column header="Tipo de Archivo">
    <template #body="{ data }">
      {{ data?.extensionArchivo || data?.nombreTipoDocumento }}
    </template>
  </Column>
  <Column header="Tamaño">
    <template #body="{ data }">
      {{ data?.tamanoArchivo || data?.tamano }}
    </template>
  </Column>
  <Column
    v-if="dirigeInvestigacion"
    header="Origen"
  >
    <template #body="{ data }">
      {{ data?.origen }}
    </template>
  </Column>
  <Column
    v-if="!readOnly"
    header="Acciones"
  >
    <template #body="slotProps">
      <AppMenuOptions
        v-model="documentoSeleccionado"
        :menu-options="opcionesDocumentos"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { useAppDialog } from '@/modules/common/composables'
import { ref, defineEmits, defineProps } from 'vue'

const emit = defineEmits(['actualizar-documento', 'descargar-documento', 'imprimir-documento', 'exportar-documento'])
const props = defineProps({
  dirigeInvestigacion: Boolean,
  readOnly: Boolean,
  selectable: Boolean
})

const documentoSeleccionado = ref()

const opcionesDocumentos = ref([
  {
    items: [
      {
        label: 'Modificar',
        command: () => emit('actualizar-documento', documentoSeleccionado.value),
        disabled: () => true
      },
      {
        label: 'Descargar',
        command: () => emit('descargar-documento', documentoSeleccionado.value),
        disabled: () => true,
        visible: () => !props.dirigeInvestigacion
      },
      {
        label: 'Imprimir',
        command: () => emit('imprimir-documento', documentoSeleccionado.value),
        disabled: () => true,
        visible: () => !props.dirigeInvestigacion
      },
      {
        label: 'Exportar a otra Causa',
        command: () => emit('exportar-documento', documentoSeleccionado.value),
        disabled: () => true,
        visible: () => props.dirigeInvestigacion
      },
      {
        label: 'Ver Documento',
        command: () => launchVerDocumentoModal(documentoSeleccionado.value)
      }
    ]
  }
])

const { launchDialog } = useAppDialog()

// /* === Ver Documento === */

const launchVerDocumentoModal = (documento) => {
  console.log({ documento })
  launchDialog({
    header: documento.name,
    confirmIcon: 'pi pi-send',
    width: '80%'
  })
}
</script>
