<template>
<section class="col-12">
  <AppDataTable
    id="dataTableRelaciones"
    v-bind="{ ...$attrs }"
  >
    <Column
      v-if="selectable"
      header-style="width: 3em"
      selection-mode="multiple"
    />
    <Column header="Victima">
      <template #body="{ data }">
        {{ data?.nombreCompletoVictima ?? 'Sin Victima' }}
      </template>
    </Column>
    <Column header="Imputado">
      <template #body="{ data }">
        {{ data?.nombreCompletoImputado ?? 'Sin Imputado' }}
      </template>
    </Column>
    <Column header="Delito">
      <template #body="{ data }">
        {{ data?.nombreDelito }}
      </template>
    </Column>
    <Column
      v-if="false"
      header="Estado de la relación"
    >
      <template #body="{ data }">
        {{ data?.idEstadoRelacion }}
      </template>
    </Column>
    <Column
      v-if="false"
      header="Etapa de la relación"
    >
      <template #body="{ data }">
        {{ data?.etapaRelacion }}
      </template>
    </Column>
    <Column
      v-if="false"
      header="Fiscal Asignado"
    >
      <template #body="{ data }">
        {{ data?.nombreFiscalAsignado || 'N/A' }}
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
/* eslint-disable */
import { defineProps } from 'vue'

defineProps({
  selectable: Boolean
})
</script>
