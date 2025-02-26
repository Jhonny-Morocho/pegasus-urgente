<template>
<AppDataTable
  v-bind="$attrs"
  id="tabla-audiencias"
  class="w-full"
>
  <Column header="Fecha">
    <template #body="{ data }">
      {{ data?.ambito }}
    </template>
  </Column>
  <Column header="Tribunal">
    <template #body="{ data }">
      {{ data?.ambito }}
    </template>
  </Column>
  <Column header="Sala">
    <template #body="{ data }">
      {{ data?.ambito }}
    </template>
  </Column>
  <Column header="Tipo de Audiencia">
    <template #body="{ data }">
      {{ data?.ambito }}
    </template>
  </Column>
  <Column header="Fiscal Litigador">
    <template #body="{ data }">
      {{ data?.ambito }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data?.ambito }}
    </template>
  </Column>
  <Column header="Resultado">
    <template #body="{ data }">
      {{ data?.ambito }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>

</script>
