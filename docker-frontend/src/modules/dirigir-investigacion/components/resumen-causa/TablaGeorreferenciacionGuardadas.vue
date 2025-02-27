<template>
<div class="w-full">
  <AppDataTable
    id="tabla-causas-relacionadas-guardadas"
    v-bind="$attrs"
    class=""
    responsive-layout="scroll"
  >
    <Column header="Tipo Delito">
      <template #body="{ data }">
        {{ data?.tipoDelito }}
      </template>
    </Column>
    <Column header="Región">
      <template #body="{ data }">
        {{ data?.region }}
      </template>
    </Column>
    <Column header="Comuna">
      <template #body="{ data }">
        {{ data?.comuna }}
      </template>
    </Column>
    <Column header="Calle">
      <template #body="{ data }">
        {{ data?.calle || '---' }}
      </template>
    </Column>
    <Column header="Número">
      <template #body="{ data }">
        {{ data?.numero || '---' }}
      </template>
    </Column>
    <Column header="Fiscalía Competente">
      <template #body="{ data }">
        {{ data?.nombreFiscalia || '---' }}
      </template>
    </Column>
    <Column
      class=""
      header="Acciones"
    >
      <template #body="data">
        <Button
          class="p-button-rounded p-button-outlined p-button-danger"
          icon="pi pi-trash"
          @click="eliminarGeorreferenciacionGuardada(data)"
        />
      </template>
    </Column>
  </AppDataTable>
</div>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['georreferencia-guardada:eliminarGeorreferencia'])

function eliminarGeorreferenciacionGuardada (georreferencia) {
  emit('georreferencia-guardada:eliminarGeorreferencia', georreferencia)
}
</script>
