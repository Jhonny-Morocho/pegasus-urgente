<template>
<section class="col-12">
  <AppDataTable
    id="especies-dinero"
    class="w-full"
    :value="personasAsisten.personasAsisten"
  >
    <Column
      v-if="!personasAsisten.comprobante"
      header="Seleccionar"
      style="width: 48px"
    >
      <template #body="{ data }">
        <div class="flex justify-content-center">
          <input
            :id="data.id"
            v-model="candidataSeleccionada"
            class="p-checkbox"
            type="checkbox"
            :value="data"
          >
        </div>
      </template>
    </Column>
    <Column header="N° Documento">
      <template #body="slotProps">
        {{ slotProps.data.nroDocumento }}
      </template>
    </Column>
    <Column header="Nombre Completo">
      <template #body="slotProps">
        {{ slotProps.data.nombreCompleto }}
      </template>
    </Column>
    <Column header="Institución">
      <template #body="slotProps">
        {{ slotProps.data.institucion }}
      </template>
    </Column>
    <Column header="Especialidad">
      <template #body="slotProps">
        {{ slotProps.data.especialidad }}
      </template>
    </Column>
  </AppDataTable>
</section>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'

defineProps({
  personasAsisten: propTypes.array
})
</script>
