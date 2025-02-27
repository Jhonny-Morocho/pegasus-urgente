<template>
<AppDataTable
  id="formalizacion-imputado"
  class="w-full"
  v-bind="$attrs"
>
  <Column header="RUC">
    <template #body="{ data }">
      {{ data?.ruc || 'N/A' }}
    </template>
  </Column>
  <Column header="Audiencia">
    <template #body="{ data }">
      {{ data?.audencia || 'N/A' }}
    </template>
  </Column>
  <Column header="Fecha Formalización">
    <template #body="{ data }">
      {{ data?.fechaFormalizacion || 'N/A' }}
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
  <Column header="Estado Causa">
    <template #body="{ data }">
      {{ data?.estadoCausa || 'N/A' }}
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
