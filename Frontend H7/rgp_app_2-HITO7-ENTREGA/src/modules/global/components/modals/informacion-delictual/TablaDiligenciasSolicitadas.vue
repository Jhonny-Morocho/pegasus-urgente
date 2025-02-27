<template>
<AppDataTable
  id="detenciones-anteriores"
  class="col-12"
  v-bind="$attrs"
>
  <Column header="Fecha solicitud">
    <template #body="{ data }">
      {{ data?.fechaSolicitud }}
    </template>
  </Column>
  <Column header="Instruído por">
    <template #body="{ data }">
      {{ data?.instruidoPor }}
    </template>
  </Column>
  <Column header="Tipo de diligencia">
    <template #body="{ data }">
      {{ data?.TipoDeDiligencia }}
    </template>
  </Column>
  <Column header="Descripción de Diligencia">
    <template #body="{ data }">
      {{ data?.descripciónDeDiligencia }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data?.Estado }}
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="slotProps">
      <AppMenuOptions
        v-model="selected"
        :menu-options="opcionesMenuAcciones"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { ref } from 'vue'
// primevue

const selected = ref(null)

const opcionesMenuAcciones = ref([
  {
    items: [
      {
        label: 'Ver ',
        icon: 'pi pi-search',
        command: () => {
          console.log('Ver ')
        }
      }
    ]
  }
])
</script>
