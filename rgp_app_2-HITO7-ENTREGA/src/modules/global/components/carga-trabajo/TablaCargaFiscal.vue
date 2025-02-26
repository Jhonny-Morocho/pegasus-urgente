<template>
<AppDataTable
  id="dataTableCargaFiscal"
  class="col-12"
  v-bind="$attrs"
>
  <Column header="Nombre del Fiscal">
    <template #body="{ data }">
      {{ data.nombreFiscal }}
    </template>
  </Column>
  <Column header="Especialidad">
    <template #body="{ data }">
      {{ data.especialidad || 'Sin Especialidad' }}
    </template>
  </Column>
  <Column header="Total Causas">
    <template #body="{ data }">
      {{ data.totalCausas }}
    </template>
  </Column>
  <Column header="Total Causas Asignadas">
    <template #body="{ data }">
      {{ data.totalCausasAsignadas }}
    </template>
  </Column>
  <Column header="Total Causas Vigentes">
    <template #body="{ data }">
      {{ data.totalCausasVigentes }}
    </template>
  </Column>
  <Column header="Semanal">
    <template #body="{ data }">
      {{ data.semanal }}
    </template>
  </Column>
  <Column header="Mensual">
    <template #body="{ data }">
      {{ data.mensual }}
    </template>
  </Column>
  <Column header="Anual">
    <template #body="{ data }">
      {{ data.anual }}
    </template>
  </Column>
  <Column header="Total">
    <template #body="{ data }">
      {{ data.total }}
    </template>
  </Column>
  <Column header="Fecha de última Asignacion">
    <template #body="{ data }">
      {{ data.fechaUltimaAsignacion }}
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>

</script>
