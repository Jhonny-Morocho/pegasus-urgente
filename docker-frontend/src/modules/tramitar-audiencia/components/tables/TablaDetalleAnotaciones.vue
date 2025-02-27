<template>
<AppDataTable
  class="w-full"
  v-bind="$attrs"
>
  <Column header="Fecha/Hora">
    <template #body="{ data }">
      {{ data?.fecha }}
    </template>
  </Column>
  <Column header="N° Docuemnto Ejecutor">
    <template #body="{ data }">
      {{ data?.numeroDocumentoEjecutor }}
    </template>
  </Column>
  <Column header="Nombre Ejecutor">
    <template #body="{ data }">
      {{ data?.nombreEjecutor }}
    </template>
  </Column>
  <Column header="Lugar de Realización">
    <template #body="{ data }">
      {{ data?.lugar }}
    </template>
  </Column>
  <Column header="Acciones Realizadas">
    <template #body="{ data }">
      {{ data?.accionesEjecutor }}
    </template>
  </Column>
</AppDataTable>
</template>
