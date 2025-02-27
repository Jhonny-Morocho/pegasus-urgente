<template>
<hr>
<section class="px-2 py-3 w-full">
  <AppDataTable
    id="tabla-resumen-especies"
    v-bind="{ ...$attrs }"
  >
    <Column header="Familia Especie">
      <template #body="{ data }">
        {{ data?.familiaEspecieDescripcion }}
      </template>
    </Column>
    <Column header="Tipo Especie">
      <template #body="{ data }">
        {{ data?.tipoEspecie }}
      </template>
    </Column>
    <Column header="Descripción">
      <template #body="{ data }">
        {{ data?.descripcion }}
      </template>
    </Column>
    <Column header="Motivo">
      <template #body="{ data }">
        {{ data?.motivoEspecie || 'N/A' }}
      </template>
    </Column>
    <Column header="Nombre Causa">
      <template #body="{ data }">
        {{ data?.nombreCausa || 'N/A' }}
      </template>
    </Column>
    <Column header="Evidencia">
      <template #body="{ data }">
        {{ data?.indicadorEvidencia ? 'SI' : 'NO' }}
      </template>
    </Column>
    <Column header="Cantidad">
      <template #body="{ data }">
        {{ data?.cantidadEspecie }}
      </template>
    </Column>
    <Column
      class="capitalize"
      field="destino"
      header="Destino"
      style="min-width: 150px"
    >
      <template #body="{ data }">
        <div class="flex flex-row md:flex-row">
          <span>{{ data?.destino || 'N/A' }} </span>
        </div>
      </template>
    </Column>
  </AppDataTable>
</section>
</template>
<script setup>
import { defineProps } from 'vue'

defineProps({})
</script>
