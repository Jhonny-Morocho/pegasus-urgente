<template>
<AppDataTable
  id="diligencias-tabla-resumen"
  v-bind="{ ...$attrs }"
>
  <Column
    v-if="selectable"
    header-style="width: 3em"
    selection-mode="multiple"
  />
  <Column header="Fecha de Instrucción">
    <template #body="{ data }">
      {{ formatDate(data?.fechaActividad) || "N/A" }}
    </template>
  </Column>
  <Column header="Tipo de Diligencia">
    <template #body="{ data }">
      {{ data?.nombreTipoActividad || "N/A" }}
    </template>
  </Column>
  <Column header="Subtipo Diligencia">
    <template #body="{ data }">
      {{ data?.nombreSubTipoActividad || "N/A" }}
    </template>
  </Column>
  <Column
    v-if="definirNuevaCausa"
    header="Descripciòn"
  >
    <template #body="{ data }">
      {{ data?.nombreSubSubTipoActividad || "N/A" }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data?.nombreEstado || "N/A" }}
    </template>
  </Column>
  <Column header="Institución Ejecutora">
    <template #body="{ data }">
      {{ data?.nombreUnidadEjecutora || "N/A" }}
    </template>
  </Column>
  <Column header="Diligencias / Instrucción">
    <template #body="{ data }">
      {{ data?.diligenciaInstruccion || "N/A" }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { dateTimeUtil } from '@/utils'
import { defineProps } from 'vue'

defineProps({
  selectable: Boolean,
  definirNuevaCausa: Boolean
})

function formatDate (date) {
  return dateTimeUtil.formatToFrontend(date)
}
</script>
