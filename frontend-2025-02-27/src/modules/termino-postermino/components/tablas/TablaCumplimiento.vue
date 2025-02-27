<template>
<section class="col-12 p-4">
  <AppDataTable
    id="dataTableCumplimientos"
    v-bind="$attrs"
  >
    <Column
      v-if="selectable"
      header-style="width: 3em"
      selection-mode="multiple"
    />
    <Column header="Fecha Registro">
      <template #body="{ data }">
        {{
          `${data?.fechaHoraRegistro.split('T')[0]} / ${
            data?.fechaHoraRegistro.split('T')[1]
          }` || '09-11-2019'
        }}
      </template>
    </Column>
    <Column header="Tipo de Condición">
      <template #body="{ data }">
        {{ mantenedor_getDescripcionCondicionById(data?.idCondicion) }}
      </template>
    </Column>
    <Column header="Lugar del Registro">
      <template #body="{ data }">
        {{ data?.lugar || 'Fiscalía Casablanca' }}
      </template>
    </Column>
    <Column header="Nivel de Cumplimiento">
      <template #body="{ data }">
        {{
          mantenedor_getDescripcionEvaluacionCumplimientosById(
            data?.idEvaluacionCumplimiento
          )
        }}
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
/*eslint-disable*/
import { useMantenedorStore } from '@/modules/global/composables';
import { defineProps } from 'vue';

const {
  mantenedor_getDescripcionCondicionById,
  mantenedor_getDescripcionEvaluacionCumplimientosById
} = useMantenedorStore();

defineProps({
  readOnly: Boolean,
  selectable: Boolean
});
</script>
