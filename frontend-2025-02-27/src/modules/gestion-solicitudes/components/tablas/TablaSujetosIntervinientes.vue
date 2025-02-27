<template>
<section>
  <AppDataTable
    v-bind="$attrs"
    id="tabla-sujetos"
  >
    <Column header="Tipo Sujeto">
      <template #body="{ data }">
        {{ data?.descripcionTipoSujeto }}
      </template>
    </Column>
    <Column header="N° Documento">
      <template #body="{ data }">
        {{ data?.numeroDocumento }}
      </template>
    </Column>
    <Column header="Nombre Completo">
      <template #body="{ data }">
        {{ data?.nombres }}
      </template>
    </Column>
    <Column header="Derivado a URAVIT">
      <template #body="{ data }">
        {{ data?.uravit }}
      </template>
    </Column>
    <Column header="Pautas Aplicadas">
      <template #body="{ data }">
        {{ data?.direccion }}
      </template>
    </Column>
    <Column header="Medidas de Protección aplicadas">
      <template #body="{ data }">
        {{ data?.comuna }}
      </template>
    </Column>
    <Column header="Medidas Cautelares Aplicadas">
      <template #body="{ data }">
        {{ data?.comuna }}
      </template>
    </Column>
  </AppDataTable>
</section>
</template>
<script setup>
import { defineProps } from 'vue'

defineProps({})
</script>
