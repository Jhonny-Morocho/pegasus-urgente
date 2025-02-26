<template>
<AppDataTable
  id="sentencias"
  class="w-full"
  v-bind="$attrs"
>
  <Column header="RUC">
    <template #body="{ data }">
      {{ data?.ruc || 'N/A' }}
    </template>
  </Column>
  <Column header="Fiscalía">
    <template #body="{ data }">
      {{ data?.fiscalia || 'N/A' }}
    </template>
  </Column>
  <Column header="Fiscal">
    <template #body="{ data }">
      {{ data?.fiscal || 'N/A' }}
    </template>
  </Column>
  <Column header="VIF">
    <template #body="{ data }">
      {{ data?.vif || 'N/A' }}
    </template>
  </Column>
  <Column header="RPA">
    <template #body="{ data }">
      {{ data?.rpa || 'N/A' }}
    </template>
  </Column>
  <Column header="Procedimiento">
    <template #body="{ data }">
      {{ data?.procedimiento || 'N/A' }}
    </template>
  </Column>
  <Column header="Delito">
    <template #body="{ data }">
      {{ data?.delito || 'N/A' }}
    </template>
  </Column>
  <Column header="Fecha Sentencia">
    <template #body="{ data }">
      {{ data?.fechaSentencia || 'N/A' }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>

</script>
