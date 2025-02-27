<template>
<AppDataTable
  id="causasAcuerdoReparatorio"
  class="col-12"
  v-bind="$attrs"
>
  <Column
    v-if="selectable"
    header-style="width: 3em"
    selection-mode="multiple"
  />
  <Column header="RUC">
    <template #body="{data}">
      <span>{{ data.ruc }}</span>
    </template>
  </Column>
  <Column header="Nombre Causa">
    <template #body="{data}">
      {{ data.nombreCausa }}
    </template>
  </Column>
  <Column header="Delito">
    <template #body="{data}">
      {{ data.nombreDelito }}
    </template>
  </Column>
  <Column header="Fecha Asignación">
    <template #body="{data}">
      {{ data.fechaAsignacion }}
    </template>
  </Column>
  <Column header="Días sin Tramitar">
    <template #body="{data}">
      {{ data.diasSinTramitar }}
    </template>
  </Column>
  <Column header="Días Última Actividad">
    <template #body="{data}">
      {{ data.diasUltimaActividad }}
    </template>
  </Column>
  <Column header="Nombre Última Actividad">
    <template #body="{data}">
      {{ data.nombreUltimaActividad }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { defineProps } from 'vue'
import AppDataTable from '@/modules/common/components/AppDataTable.vue'

defineProps({
  readOnly: Boolean,
  selectable: Boolean
})

</script>

<style scoped>
span {
  color: #2C6DDF;
  cursor: pointer;
}
</style>
