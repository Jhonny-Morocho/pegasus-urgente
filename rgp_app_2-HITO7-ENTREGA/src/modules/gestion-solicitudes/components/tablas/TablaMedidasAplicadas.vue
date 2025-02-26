<template>
<AppDataTable
  class="w-full"
  v-bind="$attrs"
>
  <Column header="Tipo de Medida">
    <template #body="{ data }">
      {{ data?.medida }}
    </template>
  </Column>
  <Column header="Medida de Protección">
    <template #body="{ data }">
      {{ data?.medida }}
    </template>
  </Column>
  <Column header="Sujeto/Interviniente">
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
</AppDataTable>
</template>
