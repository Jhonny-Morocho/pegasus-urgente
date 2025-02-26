<template>
<section>
  <AppFieldset
    :collapsed="esIngreso"
    legend="Historial de Directrices de la Causa"
    :toggleable="true"
  >
    <AppDataTable
      class="col-12"
      data-key="id"
      responsive-layout="stack"
      :value="directrices"
      v-bind="$attrs"
    >
      <Column
        field="fechaRegistroDirectriz"
        header="Fecha/Hora"
      >
        <template #body="{data}">
          {{ formatToFrontendWithTime(data?.fechaCreacion) }}
        </template>
      </Column>
      <Column
        field="usuario"
        header="Usuario"
      >
        <template #body="{data}">
          {{ data?.creadoPor }}
        </template>
      </Column>
      <Column
        class="p-0"
        field="directriz"
        header="Directriz de Investigación en la Relación"
      >
        <template #body="{data}">
          {{ data?.descripcionDirectriz }}
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</section>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils'

defineProps({
  esIngreso: Boolean,
  directrices: propTypes.array
})

const { formatToFrontendWithTime } = dateTimeUtil
</script>
