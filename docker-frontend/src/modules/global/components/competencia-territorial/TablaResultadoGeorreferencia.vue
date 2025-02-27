<template>
<AppDataTable
  id="dataTableCompetenciaTerritorial"
  breakpoint="960px"
  class="w-full"
  v-bind="$attrs"
  responsive-layout="stack"
>
  <template #header>
    <div class="flex justify-content-start align-items-center">
      <h3 class="m-2">
        Resultado Georreferenciación
      </h3>
    </div>
  </template>
  <Column
    header-style="width: 3rem"
    selection-mode="single"
  />
  <Column header="Tipo Delito">
    <template #body="{ data }">
      {{ data.delito || data.nombreDelito }}
    </template>
  </Column>
  <Column header="Dirección">
    <template #body="{ data }">
      {{ data.direccion }}
    </template>
  </Column>
  <Column header="Región">
    <template #body="{ data }">
      {{ data.region }}
    </template>
  </Column>
  <Column header="Fiscalía Competente">
    <template #body="{ data }">
      {{ data.nombreFiscalia }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
</script>
