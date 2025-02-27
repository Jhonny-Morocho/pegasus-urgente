<template>
<AppDataTable
  id="medidas-cautelares"
  class="col-12"
  v-bind="$attrs"
>
  <Column header="RUC">
    <template #body="{ data }">
      {{ data?.ruc || 'N/A' }}
    </template>
  </Column>
  <Column header="Nombre Causa">
    <template #body="{ data }">
      {{ data?.nombreCausa || 'N/A' }}
    </template>
  </Column>
  <Column header="Nombre Medida">
    <template #body="{ data }">
      {{ data?.medidasCondiciones || 'N/A' }}
    </template>
  </Column>
  <Column header="Alerta">
    <template #body="{ data }">
      {{ data?.alerta || 'N/A' }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data?.estado || 'N/A' }}
    </template>
  </Column>
  <Column header="Detalle Medida y/o Condición">
    <template #body="{ data }">
      {{ data?.detalleMedidaCondicion || 'N/A' }}
    </template>
  </Column>
  <Column header="Nro. Control">
    <template #body="{ data }">
      {{ data?.nroControl || 'N/A' }}
    </template>
  </Column>
  <Column header="Fecha de Registro">
    <template #body="{ data }">
      {{ data.fechaRegistro || 'N/A' }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>

</script>
