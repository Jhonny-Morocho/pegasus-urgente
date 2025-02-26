<template>
<div>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Lista de Antecedentes Actualizados y en espera de Actualización"
  >
    <AppDataTable
      id="tabla-antecedentes-actualizacion-actualizados"
      v-bind="$attrs"
      v-model:selection="antecedentesSeleccionados"
      class="w-full"
      responsive-layout="scroll"
      :value="antecedentes"
    >
      <Column
        header-style="width: 3em"
        selection-mode="multiple"
      />
      <Column header="Nombre Antecedente">
        <template #body="{ data }">
          {{ data?.nombreAntecedente }}
        </template>
      </Column>
      <Column header="Nombre Entidad Emisora">
        <template #body="{ data }">
          {{ data?.nombreEntidadEmisora }}
        </template>
      </Column>
      <Column header="Tipo Sujeto">
        <template #body="{ data }">
          {{ data?.tipoSujeto }}
        </template>
      </Column>
      <Column header="Nombre Completo">
        <template #body="{ data }">
          {{ data?.nombreCompleto }}
        </template>
      </Column>
      <Column header="Resultado">
        <template #body="{ data }">
          {{ data?.resultado }}
        </template>
      </Column>
      <Column header="Documento">
        <template #body="{ data }">
          {{ data?.documento }}
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { propTypes } from '@/modules/common/types'

const antecedentesSeleccionados = ref()

defineProps({
  antecedentes: propTypes.array
})
</script>
