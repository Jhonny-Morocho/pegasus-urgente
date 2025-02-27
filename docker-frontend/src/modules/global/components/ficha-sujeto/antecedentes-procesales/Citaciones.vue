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
    field="fiscalia"
    header="Fiscalía"
  >
    <template #body="data">
      {{ data.fiscalia }}
    </template>
  </Column>
  <Column
    field="citacion"
    header="Citación"
  >
    <template #body="data">
      {{ data.citacion }}
    </template>
  </Column>
  <Column
    field="tipoSujeto"
    header="Tipo Sujeto"
  >
    <template #body="data">
      {{ data.idTipoSujeto }}
    </template>
  </Column>
  <Column
    field="alerta"
    header="Alerta"
  >
    <template #body="data">
      {{ data.alerta }}
    </template>
  </Column>

  <Column
    field="asiste"
    header="Asiste"
  >
    <template #body="data">
      {{ data.Asiste }}
    </template>
  </Column>
  <Column
    field="estado"
    header="Estado"
  >
    <template #body="data">
      {{ data.estado }}
    </template>
  </Column>
  <Column
    field="fechaHoraCitacion"
    header="Fecha/Hora Citación"
  >
    <template #body="data">
      {{ data.fechaHoraCitacion }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>

</script>
