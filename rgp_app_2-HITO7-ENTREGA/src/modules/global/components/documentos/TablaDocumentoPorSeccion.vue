<template>
<AppDataTable
  id="tabla-archivos"
  class="col-12"
  v-bind="{ ...$attrs }"
>
  <Column header="Nombre Del Archivo">
    <template #body="{ data }">
      {{ data.nombre }}
    </template>
  </Column>
  <Column header="Descripcion del Archivo">
    <template #body="{ data }">
      {{ data.descripcion }}
    </template>
  </Column>
  <Column
    v-if="!readOnly"
    header="Acciones"
    style="width: 48px"
  >
    <template #body="{ data }">
      <div class="flex justify-content-center">
        <Button
          class="p-button-rounded p-button-outlined p-button-danger"
          icon="pi pi-trash"
          @click="eliminarArchivo(data)"
        />
      </div>
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  readOnly: Boolean,
})

const emit = defineEmits(['subir-archivo:eliminar'])

function eliminarArchivo (data) {
  emit('subir-archivo:eliminar', data)
}
</script>