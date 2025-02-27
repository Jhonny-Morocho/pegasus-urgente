<template>
<AppDataTable
  v-bind="$attrs"
  id="documentos-adjuntos"
  no-paginator
>
  <Column header="Nombre Archivo">
    <template #body="{ data }">
      {{ data?.nombreArchivo }}
    </template>
  </Column>
  <Column header="Descripción Archivo">
    <template #body="{ data }">
      {{ data?.descripcionArchivo }}
    </template>
  </Column>
  <Column header="Tipo de Archivo">
    <template #body="{ data }">
      {{ data?.tipoArchivo }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>

</script>
