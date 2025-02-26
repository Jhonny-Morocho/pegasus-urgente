<template>
<AppDataTable
  id="tabla-relaciones-diligencia"
  v-bind="$attrs"
  class="col-12"
>
  <Column selection-mode="multiple" />
  <Column header="Víctima">
    <template #body="{ data }">
      {{ data?.nombreCompletoVictima ?? 'Sin Victima' }}
    </template>
  </Column>
  <Column header="Imputado">
    <template #body="{ data }">
      {{ data?.nombreCompletoImputado ?? 'Sin Imputado' }}
    </template>
  </Column>
  <Column header="Delito">
    <template #body="{ data }">
      {{ data?.delito || data?.nombreDelito }}
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>

</script>
