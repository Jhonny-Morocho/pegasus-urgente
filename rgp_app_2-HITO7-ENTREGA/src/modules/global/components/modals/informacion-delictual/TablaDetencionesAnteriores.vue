<template>
<AppDataTable
  id="causas-asociadas"
  class="w-full"
  v-bind="$attrs"
>
  <Column header="RUC">
    <template #body="{ data }">
      {{ data?.ruc || 'N/A' }}
    </template>
  </Column>
  <Column header="Fecha Detencion">
    <template #body="{ data }">
      {{ data?.fechaDetencion || 'N/A' }}
    </template>
  </Column>
  <Column header="Detencion Legal">
    <template #body="{ data }">
      {{ data?.detencionIlegal || 'N/A' }}
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
