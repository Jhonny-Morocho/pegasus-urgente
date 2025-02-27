<template>
<AppDataTable
  id="tabla-fiscalia-competente"
  class="w-full"
  v-bind="$attrs"
  no-paginator
>
  <Column header="Delito">
    <template #body="{ data }">
      {{ data?.delito }}
    </template>
  </Column>
  <Column header="Región">
    <template #body="{ data }">
      {{ data?.region }}
    </template>
  </Column>
  <Column header="Comuna">
    <template #body="{ data }">
      {{ data?.comuna || 'No Encontrada' }}
    </template>
  </Column>
  <Column header="Dirección">
    <template #body="{ data }">
      {{ data?.direccion || 'No Encontrada' }}
    </template>
  </Column>
  <Column header="Fiscalía Competente">
    <template #body="{ data }">
      {{ data?.nombreFiscalia || 'No Encontrada' }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>

</script>
