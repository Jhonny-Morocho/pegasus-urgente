<template>
<AppDataTable
  id="especies-dinero"
  class="col-12"
  :value="registrosInspeccion"
>
  <Column header="Fecha">
    <template #body="slotProps">
      {{ slotProps.data.fecha }}
    </template>
  </Column>
  <Column header="Hora Inicio">
    <template #body="slotProps">
      {{ slotProps.data.horaInicio }}
    </template>
  </Column>
  <Column header="Hora Término">
    <template #body="slotProps">
      {{ slotProps.data.horaTermino }}
    </template>
  </Column>
  <Column header="Observaciones">
    <template #body="slotProps">
      {{ slotProps.data.observaciones }}
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'

defineProps({
  registrosInspeccion: propTypes.array
})

</script>

<style scoped>
    span {
        font-weight: bold;
        margin-right: 6px;
    }
    .nue {
        margin-top: 4px;
        font-size: 1.2em;
    }
</style>
