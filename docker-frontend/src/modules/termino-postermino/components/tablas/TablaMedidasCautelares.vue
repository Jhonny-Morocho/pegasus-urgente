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
      {{ data?.sujeto }}
    </template>
  </Column>
  <Column header="Vigencia">
    <template #body="{ data }">
      {{ data?.vigencia }}
    </template>
  </Column>
</AppDataTable>
</template>
<script setup></script>
