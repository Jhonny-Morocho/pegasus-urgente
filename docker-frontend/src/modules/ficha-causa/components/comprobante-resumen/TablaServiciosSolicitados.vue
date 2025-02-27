<template>
<AppDataTable
  v-bind="$attrs"
  id="servicios-solicitados"
  no-paginator
>
  <Column header="Antecedente Solicitado">
    <template #body="{ data }">
      {{ data?.antecedente }}
    </template>
  </Column>
  <Column header="Ámbito">
    <template #body="{ data }">
      {{ data?.ambito }}
    </template>
  </Column>
  <Column header="Tipo">
    <template #body="{ data }">
      {{ data?.tipo }}
    </template>
  </Column>
  <Column header="Referencia">
    <template #body="{ data }">
      {{ data?.referencia }}
    </template>
  </Column>
  <Column header="Fecha Solicitud">
    <template #body="{ data }">
      {{ data?.fechaSolicitud }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>

</script>
