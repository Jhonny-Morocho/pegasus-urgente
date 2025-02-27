<template>
<AppDataTable
  id="causas-asociadas"
  class="w-full"
  v-bind="$attrs"
>
  <Column header="RUC">
    <template #body="{ data }">
      {{ data?.ruc || 'N/A' }}
    </template>
  </Column>
  <Column header="Calidad">
    <template #body="{ data }">
      {{ data?.tipoSujeto || 'Sin Información' }}
    </template>
  </Column>
  <Column header="Nombre Causa">
    <template #body="{ data }">
      {{ data?.nombreCaso || 'N/A' }}
    </template>
  </Column>
  <Column header="Alerta">
    <template #body="{ data }">
      {{ data?.alerta || 'N/A' }}
    </template>
  </Column>
  <Column header="Fecha Agrupación">
    <template #body="{ data }">
      {{ data?.fechaAgrupacion || 'N/A' }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data?.estadoCaso || 'N/A' }}
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
        label: 'Ver Ficha Causa',
        icon: 'pi pi-list',
        command: () => {
          console.log('Ver Ficha Causa', selected.value)
        }
      }
    ]
  }
])
</script>
