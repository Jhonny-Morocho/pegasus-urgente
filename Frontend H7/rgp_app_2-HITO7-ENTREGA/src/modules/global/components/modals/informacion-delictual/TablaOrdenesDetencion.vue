<template>
<AppDataTable
  id="ordenes-detencion"
  class="w-full"
  v-bind="$attrs"
>
  <Column header="RUC">
    <template #body="{ data }">
      {{ data?.ruc }}
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
  <Column header="Delito">
    <template #body="{ data }">
      {{ data?.delito }}
    </template>
  </Column>
  <Column header="Estado Causa">
    <template #body="{ data }">
      {{ data?.estadoCausa || 'N/A' }}
    </template>
  </Column>
  <Column header="Fecha Órden">
    <template #body="{ data }">
      {{ data?.fechaOrden }}
    </template>
  </Column>
  <Column header="Estado Órden">
    <template #body="{ data }">
      {{ data?.estadoOrden || 'N/A' }}
    </template>
  </Column>
  <Column header="Fecha Término Órden">
    <template #body="{ data }">
      {{ data?.fechaTermino || 'N/A' }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>

</script>
