<template>
<AppDataTable
  id="tabla-historial-etapa"
  v-bind="$attrs"
>
  <Column header="Actividad">
    <template #body="{ data }">
      {{ data?.actividad }}
    </template>
  </Column>
  <Column header="Fecha Actividad">
    <template #body="{ data }">
      {{ data?.fechaActividad }}
    </template>
  </Column>
  <Column header="Etapa">
    <template #body="{ data }">
      {{ data?.etapa }}
    </template>
  </Column>
  <Column header="Origen">
    <template #body="{ data }">
      {{ data?.origen }}
    </template>
  </Column>
  <Column header="Autor o Ejecutor">
    <template #body="{ data }">
      {{ data?.autor }}
    </template>
  </Column>
  <Column header="Rol">
    <template #body="{ data }">
      {{ data?.rol }}
    </template>
  </Column>
  <Column header="Documento">
    <template #body="{ data }">
      <Button
        class="ml-3 p-button-rounded p-button-text"
        icon="pi pi-file"
        @click="verDocumento(data)"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>

function verDocumento (data) {
  console.log(data)
}
</script>
