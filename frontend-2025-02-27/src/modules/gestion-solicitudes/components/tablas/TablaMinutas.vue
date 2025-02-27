<template>
<AppDataTable
  class="w-full"
  v-bind="$attrs"
>
  <Column header="Referencia">
    <template #body="{ data }">
      {{ data?.diligencia }}
    </template>
  </Column>
  <Column header="Fecha">
    <template #body="{ data }">
      {{ data?.diligencia }}
    </template>
  </Column>
  <Column header="Emisor">
    <template #body="{ data }">
      {{ data?.diligencia }}
    </template>
  </Column>

  <Column header="Destinatario">
    <template #body="{ data }">
      {{ data?.diligencia }}
    </template>
  </Column>
</AppDataTable>
</template>
