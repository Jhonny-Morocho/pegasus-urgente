<template>
<AppDataTable
  id="dataTableCompetenciaTerritorial"
  breakpoint="960px"
  class="w-full"
  responsive-layout="stack"
  v-bind="$attrs"
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
    selection-mode="multiple"
  />
  <Column header="Tipo Delito">
    <template #body="{data}">
      {{ data.delito || data.nombreDelito }}
    </template>
  </Column>
  <Column header="Región">
    <template #body="{data}">
      {{ data.region }}
    </template>
  </Column>
  <Column header="Comuna">
    <template #body="{data}">
      {{ data.comuna }}
    </template>
  </Column>
  <Column header="Calle">
    <template #body="{data}">
      {{ data.calle }}
    </template>
  </Column>
  <Column header="Número">
    <template #body="{data}">
      {{ data.numero }}
    </template>
  </Column>
  <Column header="Fiscalía Competente">
    <template #body="{data}">
      {{ data.nombreFiscalia }}
    </template>
  </Column>
</AppDataTable>
</template>
