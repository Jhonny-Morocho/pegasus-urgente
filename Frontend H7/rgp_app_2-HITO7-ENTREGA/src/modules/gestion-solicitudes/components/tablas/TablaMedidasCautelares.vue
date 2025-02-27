<template>
<AppDataTable
  class="w-full"
  v-bind="$attrs"
>
  <Column header="Medida">
    <template #body="{ data }">
      {{ data?.medida }}
    </template>
  </Column>
  <Column header="Sujeto/Interviniente">
    <template #body="{ data }">
      {{ data?.medida }}
    </template>
  </Column>
  <Column header="Dirección">
    <template #body="{ data }">
      {{ data?.medida }}
    </template>
  </Column>
  <Column header="Vigencia">
    <template #body="{ data }">
      {{ data?.medida }}
    </template>
  </Column>
  <Column header="Institución encargada ">
    <template #body="{ data }">
      {{ data?.medida }}
    </template>
  </Column>
  <Column header="Resultado">
    <template #body="{ data }">
      {{ data?.medida }}
    </template>
  </Column>
</AppDataTable>
</template>
