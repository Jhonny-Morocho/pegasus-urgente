<template>
<AppFieldset
  class="col-12"
  legend="Anotaciones"
>
  <AppDataTable
    class="col-12"
    :value="dataAnotaciones"
    v-bind="{ ...$attrs }"
  >
    <Column header="Anotación">
      <template #body="data">
        {{ data.data.recomendacionPreclasificacion }}
      </template>
    </Column>
    <Column header="Usuario">
      <template #body="data">
        {{ data.data.idDenuncia }}
      </template>
    </Column>
    <Column header="Cargo">
      <template #body="data">
        {{ data.data.idDenuncia }}
      </template>
    </Column>
    <Column header="Etapa">
      <template #body="data">
        {{ data.data.idEstado }}
      </template>
    </Column>
    <Column header="Fecha">
      <template #body="data">
        {{ data.data.fechaDenuncia }}
      </template>
    </Column>
  </AppDataTable>
</AppFieldset>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'
import AppDataTable from '@/modules/common/components/AppDataTable.vue'

defineProps({
  dataAnotaciones: propTypes.array
})
</script>
