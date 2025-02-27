<template>
<div class="col-12">
  <AppDataTable
    id="tabla-historial"
    v-bind="$attrs"
  >
    <Column header="Fecha Actualización">
      <template #body="{data}">
        {{ formatDate(data.fechaActualizacion) }}
      </template>
    </Column>
    <Column header="Tipo de Actividad">
      <template #body="{data}">
        {{ data.tipoActividad }}
      </template>
    </Column>
    <Column header="Usuario">
      <template #body="{data}">
        {{ data.usuario }}
      </template>
    </Column>
  </AppDataTable>
</div>
</template>
<script setup>
// DISCLAIMER: ESTA TABLA (EN TEORIA DEBERIA SERVIR PARA TODOS LOS HISTORIALES
// SUPONIENDO QUE BACKEND CREE UN SOLO ENDPOINT PARA ESTE, SIMILAR A BANDEJA
import { dateTimeUtil } from '@/utils'

function formatDate (value) {
  return dateTimeUtil.formatToFrontendWithTime(value)
}
</script>
