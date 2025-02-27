<template>
<section class="col-12">
  <AppDataTable
    id="dataTableDocumentos"
    :lazy="true"
    v-bind="$attrs"
  >
    <Column
      v-if="route.name === 'FichaCausa'"
      header="Seleccionar"
    >
      <template #body="{ data }">
        <div class="flex justify-content-center">
          <input
            :id="data.id"
            v-model="docSeleccionado"
            class="p-checkbox"
            type="radio"
            :value="data"
          >
        </div>
      </template>
    </Column>
    <Column
      v-if="route.name === 'FichaCausa'"
      header="Procedencia"
    >
      <template #body="{ data }">
        {{ data.procedencia }}
      </template>
    </Column>
    <Column header="Nombre del Archivo">
      <template #body="{ data }">
        {{ data.nombre }}
      </template>
    </Column>
    <Column
      v-if="route.name !== 'FichaCausa'"
      header="Descripción del Archivo"
    >
      <template #body="{ data}">
        {{ descripcionDelArchivo(data) }}
      </template>
    </Column>
    <Column
      v-if="route.name !== 'FichaCausa'"
      header="Tipo de Archivo"
    >
      <template #body="{ data }">
        {{ data.extension || 'N/A' }}
      </template>
    </Column>
    <Column
      v-if="route.name === 'FichaCausa'"
      header="Clase Documental"
    >
      <template #body="{ data }">
        {{ data.claseDocumental }}
      </template>
    </Column>
    <Column
      v-if="route.name === 'FichaCausa'"
      header="Formato Recepción"
    >
      <template #body="{ data }">
        {{ data.formatoRecepcion }}
      </template>
    </Column>
    <Column
      v-if="route.name === 'FichaCausa'"
      header="Fecha de agregación al CDD"
    >
      <template #body="{ data }">
        {{ data.fechaAgregacion }}
      </template>
    </Column>
    <Column
      v-if="route.name === 'FichaCausa'"
      header="Fecha de última actualizcion"
    >
      <template #body="{ data }">
        {{ data.fechaUltimaActualizacion }}
      </template>
    </Column>
    <Column
      v-if="route.name === 'FichaCausa'"
      header="Versión"
    >
      <template #body="{ data }">
        {{ data.nombreArchivo }}
      </template>
    </Column>
    <Column
      v-if="!isEditando && !readOnly"
      class="text-center"
      header="Acciones"
      style="width: 0"
    >
      <template #body="{ data }">
        <div class="flex justify-content-center">
          <Button
            aria-controls="overlay_menu"
            aria-haspopup="true"
            class="p-button-rounded p-button-outlined btn-primary-outline"
            icon="pi pi-ellipsis-v"
            type="button"
            @click="toggleAcciones($event, data)"
          />
        </div>
      </template>
    </Column>
  </AppDataTable>
  <Menu
    id="overlay_menu"
    ref="menuAccionesDocumentos"
    :model="menuDocumentos"
    :popup="true"
  />
</section>
</template>

<script setup>
// COMPONENTS

// UTILS
import { useRoute } from 'vue-router'
import { defineEmits, defineProps, ref } from 'vue'

// COMPOSABLES
const route = useRoute()

// VALUES
const documentoSeleccionado = ref({})
const menuAccionesDocumentos = ref(null)
function descripcionDelArchivo (data) {
  return data?.descripcion || data?.resumen || 'N/A'
}

defineProps({
  isEditando: Boolean,
  readOnly: Boolean
})

const emit = defineEmits([
  'documentos:eliminar-documento',
  'documentos:editar-documento'
])

// LOGIC

function emitEliminarDocumento (documento) {
  emit('documentos:eliminar-documento', documento)
}

function emitEditarDocumento (documento) {
  emit('documentos:editar-documento', documento)
}

function toggleAcciones (event, data) {
  documentoSeleccionado.value = data
  menuAccionesDocumentos.value.toggle(event)
}

const menuDocumentos = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Eliminar Documento',
        command: () => emitEliminarDocumento(documentoSeleccionado.value)
      },
      {
        label: 'Editar Documento',
        command: () => emitEditarDocumento(documentoSeleccionado.value)
      }
    ]
  }
])
</script>
