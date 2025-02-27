<template>
<AppDataTable
  v-bind="$attrs"
  id="tabla-relaciones"
  class="w-full"
>
  <Column header="Víctima">
    <template #body="{ data }">
      {{ data?.nombreCompletoVictima || "Sin Víctima" }}
    </template>
  </Column>
  <Column header="Imputado">
    <template #body="{ data }">
      {{ data?.nombreCompletoImputado || "Sin Imputado" }}
    </template>
  </Column>
  <Column header="Delito">
    <template #body="{ data }">
      {{ data?.nombreDelito }}
    </template>
  </Column>
  <Column header="Estado de la Relación">
    <template #body="{ data }">
      {{ data?.estadoRelacionDescripcion || 'N/A' }}
    </template>
  </Column>
  <Column header="Etapa de la Relación">
    <template #body="{ data }">
      {{ data?.etapaRelacionDescripcion || 'N/A' }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>

</script>
