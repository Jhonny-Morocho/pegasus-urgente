<template>
<AppDataTable
  class="w-full"
  v-bind="$attrs"
>
  <Column header="Pauta">
    <template #body="{ data }">
      {{ data?.pauta }}
    </template>
  </Column>
  <Column header="Usuario quien Aplica">
    <template #body="{ data }">
      {{ data?.usuarioQueAplica }}
    </template>
  </Column>
  <Column header="Evaluación de Riesgo">
    <template #body="{ data }">
      {{ data?.evaluacionRiesgo }}
    </template>
  </Column>
  <Column
    class="flex md:justify-content-center md:align-items-center"
    header="Acciones"
  >
    <template #body="{ data }">
      <Button
        class="p-button-outlined p-button-danger p-button-rounded"
        icon="pi pi-trash"
        @click="eliminarPauta(data)"
      />
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['eliminar-pauta'])

function eliminarPauta (pauta) {
  emit('eliminar-pauta', pauta)
}
</script>
