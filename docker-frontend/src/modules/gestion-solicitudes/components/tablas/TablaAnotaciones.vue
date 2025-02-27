<template>
<AppDataTable
  class="w-full"
  v-bind="$attrs"
>
  <Column header="Anotación">
    <template #body="{ data }">
      {{ data?.medida }}
    </template>
  </Column>
  <Column header="Autor - Rol">
    <template #body="{ data }">
      {{ data?.medida }}
    </template>
  </Column>
  <Column header="Etapa">
    <template #body="{ data }">
      {{ data?.medida }}
    </template>
  </Column>
  <Column header="Fecha">
    <template #body="{ data }">
      {{ data?.medida }}
    </template>
  </Column>
</AppDataTable>
</template>
