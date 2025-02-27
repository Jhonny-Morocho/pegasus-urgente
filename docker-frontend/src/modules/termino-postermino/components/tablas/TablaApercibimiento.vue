<template>
<AppDataTable
  class="w-full"
  v-bind="$attrs"
>
  <Column header="Nombre">
    <template #body="{ data }">
      {{ data?.sujeto }}
    </template>
  </Column>
  <Column header="Tipo Sujeto">
    <template #body="{ data }">
      {{ data?.tipoSujeto }}
    </template>
  </Column>
  <Column header="Apercibimiento">
    <template #body="{ data }">
      {{ data?.apercibimiento ? 'Si' : 'No' }}
    </template>
  </Column>
</AppDataTable>
</template>
<script setup></script>
