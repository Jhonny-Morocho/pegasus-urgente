<template>
<div class="grid">
  <div class="col-12 md:col-4">
    <h4>Nombre:</h4>
    <p>{{ data.representados?.nombre }}</p>
  </div>
  <div class="col-12 md:col-4">
    <h4>Calidad:</h4>
    <p>{{ data.representados?.calidad }}</p>
  </div>
  <div class="col-12">
    <AppFieldset
      legend="Lista de Representados"
    >
      <div class="col-12 md:col-6 md:col-offset-6 lg:col-4 lg:col-offset-8">
        <div
          class="p-inputgroup px-2"
          style="height: 36px; margin-top: 6px"
        >
          <InputText
            v-model="buscar"
            placeholder="Buscar"
          />
          <Button
            class="btn-primary"
            icon="pi pi-search"
          />
        </div>
      </div>
      <AppDataTable
        class="w-full"
        value=""
      >
        <Column
          field="tipoSujeto"
          header="Tipo Sujeto"
        >
          <template #body="slotProps">
            {{ slotProps?.data }}
          </template>
        </Column>
        <Column
          field="numeroDocumento"
          header="N° Documento"
        >
          <template #body="slotProps">
            {{ slotProps?.data }}
          </template>
        </Column>
        <Column
          field="nombreCompleto"
          header="Nombre Completo"
        >
          <template #body="slotProps">
            {{ slotProps?.data }}
          </template>
        </Column>
        <Column
          field="tipoPersona"
          header="Tipo Persona"
        >
          <template #body="slotProps">
            {{ slotProps?.data }}
          </template>
        </Column>
        <Column
          field="nacionalidad"
          header="Nacionalidad"
        >
          <template #body="slotProps">
            {{ slotProps?.data }}
          </template>
        </Column>
        <Column
          field="edad"
          header="Edad"
        >
          <template #body="slotProps">
            {{ slotProps?.data }}
          </template>
        </Column>
        <Column
          field="genero"
          header="Genero"
        >
          <template #body="slotProps">
            {{ slotProps?.data }}
          </template>
        </Column>
      </AppDataTable>
    </AppFieldset>
  </div>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'
const data = defineProps({
  representados: propTypes.object
})
</script>
