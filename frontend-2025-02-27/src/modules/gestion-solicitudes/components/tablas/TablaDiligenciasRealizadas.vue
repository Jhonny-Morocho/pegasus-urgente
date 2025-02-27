<template>
<AppDataTable
  class="w-full"
  v-bind="$attrs"
>
  <Column header="Tipo de instrucción">
    <template #body="{ data }">
      {{ data?.diligencia }}
    </template>
  </Column>
  <Column header="Descripción">
    <template #body="{ data }">
      {{ data?.diligencia }}
    </template>
  </Column>

  <Column header="Fecha">
    <template #body="{ data }">
      {{ data?.diligencia }}
    </template>
  </Column>

  <Column header="Institución Ejecutora">
    <template #body="{ data }">
      {{ data?.diligencia }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data?.diligencia }}
    </template>
  </Column>
</AppDataTable>
</template>
