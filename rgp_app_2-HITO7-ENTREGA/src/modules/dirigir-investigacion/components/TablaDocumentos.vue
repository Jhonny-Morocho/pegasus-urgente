<template>
<AppDataTable
  id="tabla-documentos"
  v-bind="$attrs"
  :loading="loading"
>
  <Column
    v-if="selectable"
    header-style="width: 3em"
    selection-mode="multiple"
  />
  <Column header="Nombre del Archivo">
    <template #body="{ data }">
      {{ data?.nombreArchivo || 'N/A' }}
    </template>
  </Column>
  <Column header="Descripción del Archivo">
    <template #body="{ data }">
      {{ data?.descripcionArchivo || 'N/A' }}
    </template>
  </Column>
  <Column
    v-if="dirigeInvestigacion"
    header="Fecha Creación"
  >
    <template #body="{ data }">
      {{ data?.fechaCreacion || 'N/A' }}
    </template>
  </Column>
  <Column header="Tipo de Archivo">
    <template #body="{ data }">
      {{ data?.tipoArchivo || 'N/A' }}
    </template>
  </Column>
  <Column header="Tamaño">
    <template #body="{ data }">
      {{ data?.tamanoArchivo || 'N/A' }}
    </template>
  </Column>
  <Column
    v-if="dirigeInvestigacion"
    header="Estado"
  >
    <template #body="{ data }">
      {{ data?.estado || '--' }}
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
import { ref, defineEmits, defineProps } from 'vue'

const emit = defineEmits(['actualizar-documento', 'descargar-documento', 'imprimir-documento', 'ver-documento', 'exportar-documento'])
const props = defineProps({
  dirigeInvestigacion: Boolean,
  consultarCierre: Boolean,
  readOnly: Boolean,
  loading: Boolean,
  selectable: Boolean
})

const documentoSeleccionado = ref()

const opcionesDocumentos = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Modificar',
        command: () => emit('actualizar-documento', documentoSeleccionado.value),
        disabled: () => true,
        visible: () => !props.consultarCierre
      },
      {
        label: 'Descargar',
        command: () => emit('descargar-documento', documentoSeleccionado.value),
        disabled: () => !props.consultarCierre,
        visible: () => !props.dirigeInvestigacion
      },
      {
        label: 'Imprimir',
        command: () => emit('imprimir-documento', documentoSeleccionado.value),
        disabled: () => !props.consultarCierre,
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
        command: () => emit('ver-documento', documentoSeleccionado.value)
      }
    ]
  }
])
</script>
