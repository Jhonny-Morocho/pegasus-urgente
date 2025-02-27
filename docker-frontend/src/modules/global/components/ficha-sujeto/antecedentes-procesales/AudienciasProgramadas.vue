<template>
<AppDataTable
  id="direcciones-sujeto"
  class="col-12"
  :value="data"
>
  <Column
    field="ruc"
    header="RUC"
  >
    <template #body="{ data }">
      <Button
        class="p-button-text pl-0 ml-0 btn-primary-outline"
        :label="data?.ruc"
        @click="sendToFichaCausa(data)"
      />
    </template>
  </Column>
  <Column
    field="tipoSujeto"
    header="Tipo Sujeto"
  >
    <template #body="data">
      {{ data.tipoSujeto }}
    </template>
  </Column>
  <Column
    field="tipoAudiencia"
    header="Tipo Audiencia/Citación"
  >
    <template #body="data">
      {{ data.tipoAudiencia }}
    </template>
  </Column>
  <Column
    field="fechaHora"
    header="Fecha/Hora"
  >
    <template #body="data">
      {{ data.fechaHora }}
    </template>
  </Column>
  <Column
    field="tribunal"
    header="Tribunal"
  >
    <template #body="data">
      {{ data.tribunal }}
    </template>
  </Column>
  <Column
    field="numeroDeSala"
    header="Nro. de Sala"
  >
    <template #body="data">
      {{ data.numeroDeSala }}
    </template>
  </Column>
  <Column
    field="documento"
    header="Documento"
  >
    <template #body="{ data }">
      <Button
        class="p-button-rounded p-button-outlined"
        icon="pi pi-file"
        type="button"
        @click="showDocument(data.documentoUrl)"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>

</script>
