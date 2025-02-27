<template>
<AppDataTable
  id="antecedentes-especificos"
  v-bind="$attrs"
>
  <Column header="Antecedentes Disponibles">
    <template #body="{data}">
      {{ data.nombreAntecedente }}
    </template>
  </Column>
  <Column header="Origen">
    <template #body="{data}">
      {{ data.nombreOrigen }}
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="{data}">
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
