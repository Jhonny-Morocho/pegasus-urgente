<template>
<LoaderSkeleton v-if="isLoading" />
<AppDataTable
  v-else
  id="tabla-documentos"
  v-bind="$attrs"
>
  <Column header="Nombre del Archivo">
    <template #body="{data}">
      {{ data?.nombreArchivo || data?.nombre }}
    </template>
  </Column>
  <Column header="Descripción del Archivo">
    <template #body="{data}">
      {{ descripcionArchivo(data) }}
    </template>
  </Column>
  <Column
    v-if="dirigeInvestigacion"
    header="Fecha Creación"
  >
    <template #body="{data}">
      {{ data?.fechaCreacion }}
    </template>
  </Column>
  <Column header="Tipo de Archivo">
    <template #body="{data}">
      {{ tipoArchivo(data) }}
    </template>
  </Column>
  <Column header="Tamaño">
    <template #body="{data}">
      {{ tamanoArchivo(data) }}
    </template>
  </Column>
  <Column
    v-if="dirigeInvestigacion"
    header="Origen"
  >
    <template #body="{data}">
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
// COMPONENTS
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

// UTILS
import { ref, defineEmits, defineProps } from 'vue'

// COMPONSABLES

// VALUES
const documentoSeleccionado = ref()

const props = defineProps({
  dirigeInvestigacion: Boolean,
  readOnly: Boolean,
  isLoading: Boolean
})

const emit = defineEmits([
  'actualizar-documento',
  'descargar-documento',
  'imprimir-documento',
  'ver-documento',
  'exportar-documento'
])

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
        command: () => emit('ver-documento', documentoSeleccionado.value)
      }
    ]
  }
])

// LOGIC
function descripcionArchivo (data) {
  return data?.descripcionArchivo || data?.descripcion || data?.resumen || 'N/A'
}

function tipoArchivo (data) {
  return data?.extensionArchivo || data?.nombreTipoDocumento || 'N/A'
}

function tamanoArchivo (data) {
  return data?.tamanoArchivo || data?.tamano || 'N/A'
}

</script>
