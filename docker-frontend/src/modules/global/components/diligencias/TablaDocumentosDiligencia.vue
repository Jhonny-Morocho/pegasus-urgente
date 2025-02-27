<template>
<AppDataTable
  id="tabla-documentos-diligencia"
  v-bind="$attrs"
  class="col-12"
>
  <Column
    class="text-center"
    selection-mode="multiple"
  />

  <Column
    header="Nombre del Archivo"
  >
    <template #body="{ data }">
      {{ data?.nombreArchivo }}
    </template>
  </Column>
  <Column
    header="Descripción del Archivo"
  >
    <template #body="{ data }">
      {{ data?.descripcionArchivo }}
    </template>
  </Column>
  <Column
    header="Tipo de Archivo"
  >
    <template #body="{ data }">
      {{ data?.tipoArchivo }}
    </template>
  </Column>
  <Column
    class="text-center"
    header="Tamaño"
  >
    <template #body="{ data }">
      {{ data?.tamanoArchivo }}
    </template>
  </Column>
  <Column
    class="text-center"
    header="Acciones"
  >
    <template #body="slotProps">
      <AppMenuOptions
        v-model="documentoSeleccionado"
        :menu-options="opcionesDocumento"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { ref, defineEmits } from 'vue'
import AppMenuOptions from '@/modules/common/components/AppMenuOptions.vue'

const documentoSeleccionado = ref()

const emit = defineEmits(['documento:ver', 'documento:actualizar', 'documento:imprimir', 'documento:descargar'])

const opcionesDocumento = [
  {
    label: 'Acciones para la tarea',
    items: [
      {
        label: 'Actualizar',
        command: () => actualizarDocumento(),
        disabled: () => true
      },
      {
        label: 'Imprimir',
        command: () => imprimirDocumento(),
        disabled: () => true
      },
      {
        label: 'Descargar',
        command: () => descargarDocumento(),
        disabled: () => true
      },
      {
        label: 'Ver Documento',
        command: () => verDocumento()
      }
    ]
  }
]

function verDocumento () {
  console.log('🚀 ~ file: TablaDocumentosDiligencia.vue ~ line 95 ~ verDocumento ~ documentoSeleccionado.value', documentoSeleccionado.value)
  emit('documento:ver', documentoSeleccionado.value)
}

function actualizarDocumento () {
  console.log('🚀 ~ file: TablaDocumentosDiligencia.vue ~ line 100 ~ actualizarDocumento ~ documentoSeleccionado.value', documentoSeleccionado.value)
  emit('documento:actualizar', documentoSeleccionado.value)
}

function imprimirDocumento () {
  console.log('🚀 ~ file: TablaDocumentosDiligencia.vue ~ line 105 ~ imprimirDocumento ~ documentoSeleccionado.value', documentoSeleccionado.value)
  emit('documento:imprimir', documentoSeleccionado.value)
}

function descargarDocumento () {
  console.log('🚀 ~ file: TablaDocumentosDiligencia.vue ~ line 110 ~ descargarDocumento ~ documentoSeleccionado.value', documentoSeleccionado.value)
  emit('documento:descargar', documentoSeleccionado.value)
}
</script>
