<template>
<AppDataTable
  id="antecedentes-especificos"
  v-bind="$attrs"
>
  <template #header>
    <div class="flex justify-content-start align-items-center">
      <h3 class="mb-2">
        Antecedentes Especificos Disponibles
      </h3>
    </div>
  </template>
  <Column header="Antecedentes Disponibles">
    <template #body="{ data }">
      {{ data?.descripcionAntecedente }}
    </template>
  </Column>
  <Column header="Origen">
    <template #body="{ data }">
      {{ data?.descripcionOrigen }}
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="{ data }">
      <span>
        <Button
          v-tooltip="'Completar Información de la Solicitud'"
          class="p-button-rounded p-button-outlined p-button-warning"
          icon="pi pi-pencil"
          @click="solicitarAntecedente(data)"
        />
      </span>
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['solicitar-antecedente'])

function solicitarAntecedente (data) {
  emit('solicitar-antecedente', data)
}
</script>
