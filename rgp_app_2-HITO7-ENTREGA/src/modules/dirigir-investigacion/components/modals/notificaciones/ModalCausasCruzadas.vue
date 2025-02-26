<template>
<div>
  <AppFieldset
    legend="Lista de Posibles Causas Cruzadas"
  >
    <AppDataTable
      id="tabla-causas-relacionadas-guardadas"
      v-bind="$attrs"
      class=""
      responsive-layout="scroll"
      :value="causasRelacionadasGuardadas"
    >
      <Column header="RUC">
        <template #body="{ data }">
          {{ data?.ruc }}
        </template>
      </Column>
      <Column header="Victima">
        <template #body="{ data }">
          {{ data?.victima }}
        </template>
      </Column>
      <Column header="Imputado">
        <template #body="{ data }">
          {{ data?.imputado }}
        </template>
      </Column>
      <Column header="Estado">
        <template #body="{ data }">
          {{ data?.estado }}
        </template>
      </Column>
      <Column header="Delito">
        <template #body="{ data }">
          {{ data?.delito }}
        </template>
      </Column>
      <Column header="Fecha Delito">
        <template #body="{ data }">
          {{ data?.fechaDelito }}
        </template>
      </Column>
      <Column header="Alerta">
        <template #body="{ data }">
          {{ data?.alerta }}
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</div>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  causasRelacionadasGuardadas: propTypes.array
})
</script>
