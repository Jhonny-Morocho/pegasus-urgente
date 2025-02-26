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
  <Column header="Procedencia">
    <template #body="{ data }">
      {{ data?.procedencia }}
    </template>
  </Column>
  <Column header="Nombre del Archivo">
    <template #body="{ data }">
      {{ data?.nombreArchivo || data?.nombre }}
    </template>
  </Column>
  <Column header="Clase Documental">
    <template #body="{ data }">
      {{ data?.claseDocumental }}
    </template>
  </Column>
  <Column header="Formato recepción">
    <template #body="{ data }">
      {{ data?.formato }}
    </template>
  </Column>
  <Column header="Fecha de agregación al CDD">
    <template #body="{ data }">
      {{ data?.fechaAgregacion }}
    </template>
  </Column>
  <Column header="Fecha de última actualización">
    <template #body="{ data }">
      {{ data?.fechaActualizacion }}
    </template>
  </Column>
  <Column header="Versión">
    <template #body="{ data }">
      {{ data?.version }}
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

const emit = defineEmits([
  'actualizar-documento',
  'descargar-documento',
  'imprimir-documento',
  'ver-documento',
  'exportar-documento',
  'ver-detalle-documento',
  'ver-versiones-documento'
])
const props = defineProps({
  dirigeInvestigacion: Boolean,
  readOnly: Boolean,
  selectable: Boolean
})

const documentoSeleccionado = ref()

const opcionesDocumentos = ref([
  {
    items: [
      // {
      //   label: 'Modificar',
      //   command: () => emit('actualizar-documento', documentoSeleccionado.value),
      //   disabled: () => true
      // },
      {
        label: 'Descargar',
        command: () => emit('descargar-documento', documentoSeleccionado.value),
        disabled: () => true,
        visible: () => !props.dirigeInvestigacion
      },
      // {
      //   label: 'Imprimir',
      //   command: () => emit('imprimir-documento', documentoSeleccionado.value),
      //   disabled: () => true,
      //   visible: () => !props.dirigeInvestigacion
      // },
      // {
      //   label: 'Exportar a otra Causa',
      //   command: () => emit('exportar-documento', documentoSeleccionado.value),
      //   disabled: () => true,
      //   visible: () => props.dirigeInvestigacion
      // },
      {
        label: 'Ver Documento',
        command: () => emit('ver-documento', documentoSeleccionado.value)
      },
      {
        label: 'Ver Detalle Documento',
        command: () => emit('ver-detalle-documento', documentoSeleccionado.value)
      },
      {
        label: 'Ver Historial de versiones',
        command: () => emit('ver-versiones-documento', documentoSeleccionado.value)
      }
    ]
  }
])
</script>
