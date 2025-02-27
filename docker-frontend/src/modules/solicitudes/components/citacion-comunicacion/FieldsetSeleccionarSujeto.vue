<template>
<AppFieldset
  class="w-full mt-4 p-2 m-0"
  legend="Seleccionar Sujeto"
>
  <AppDataTable
    id="antecedentes-especificos"
    v-bind="$attrs"
    class="w-full"
  >
    <Column
      header-style="width: 3em"
      selection-mode="single"
    />

    <Column header="Tipo Sujeto">
      <template #body="{ data }">
        {{ data?.tipoSujeto }}
      </template>
    </Column>
    <Column header="N° Documento">
      <template #body="{ data }">
        {{ data?.descripcionOrigen }}
      </template>
    </Column>
    <Column header="Nombre Completo">
      <template #body="{ data }">
        {{ data?.descripcionOrigen }}
      </template>
    </Column>
    <Column header="Edad">
      <template #body="{ data }">
        {{ data?.descripcionOrigen }}
      </template>
    </Column>
    <Column header="Alerta">
      <template #body="{ data }">
        {{ data?.descripcionOrigen }}
      </template>
    </Column>
    <Column header="Dirección">
      <template #body="{ data }">
        {{ data?.descripcionOrigen }}
      </template>
    </Column>
  </AppDataTable>
</AppFieldset>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  title: propTypes.string,
  causa: propTypes.object,
  esCitacion: propTypes.boolean
})
</script>
