<template>
<AppDataTable
  id="audiencias-programadas"
  class="w-full"
  v-bind="$attrs"
>
  <Column header="RUC">
    <template #body="{ data }">
      {{ data?.ruc }}
    </template>
  </Column>
  <Column header="Tipo Sujeto">
    <template #body="{ data }">
      {{ data?.tipoParticipante }}
    </template>
  </Column>
  <Column header="Tipo Audiencia/Citación">
    <template #body="{ data }">
      {{ data?.tipoEvento || 'N/A' }}
    </template>
  </Column>
  <Column header="Fecha/Hora">
    <template #body="{ data }">
      {{ data?.fechaEvento }}
    </template>
  </Column>
  <Column header="Tribunal">
    <template #body="{ data }">
      {{ data?.tribunal }}
    </template>
  </Column>
  <Column header="Nro. de Sala">
    <template #body="{ data }">
      {{ data?.nroSala || 'N/A' }}
    </template>
  </Column>
  <Column header="Documento">
    <template #body="{ data }">
      <Button
        v-if="data?.idDocumentoSolicitud"
        class="p-button-rounded p-button-outlined"
        icon="pi pi-file"
        type="button"
        @click="openModalVerDocumento(data?.idDocumentoSolicitud)"
      />
      <span v-else>Sin Documento</span>
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>

// eslint-disable-next-line no-undef
const emit = defineEmits(['ver-documento'])

function openModalVerDocumento (idDocumento) {
  emit('ver-documento', idDocumento)
}
</script>
