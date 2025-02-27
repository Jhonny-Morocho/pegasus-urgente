<template>
<AppDataTable
  id="resoluciones-aplicadas"
  class="w-full"
  v-bind="$attrs"
>
  <Column header="RUC">
    <template #body="{ data }">
      {{ data?.ruc || 'N/A' }}
    </template>
  </Column>
  <Column header="Fecha Acuerdo">
    <template #body="{ data }">
      {{ data?.fechaAcuerdo || 'N/A' }}
    </template>
  </Column>
  <Column header="Delito">
    <template #body="{ data }">
      {{ data?.delito || 'N/A' }}
    </template>
  </Column>
  <Column header="Fiscalía">
    <template #body="{ data }">
      {{ data?.fiscalia || 'N/A' }}
    </template>
  </Column>
  <Column header="Detalle">
    <template #body="{ data }">
      {{ data?.detalle || 'N/A' }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>

</script>
