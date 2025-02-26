<template>
<AppDataTable
  id="audiencias-programadas"
  class="col-12"
  v-bind="$attrs"
>
  <Column header="RUC">
    <template #body="{ data }">
      {{ data?.ruc }}
    </template>
  </Column>
  <Column header="Fiscalia">
    <template #body="{ data }">
      {{ data?.fiscalia }}
    </template>
  </Column>
  <Column header="Atención">
    <template #body="{ data }">
      {{ data?.Atención }}
    </template>
  </Column>
  <Column header="Tipo Sujeto">
    <template #body="{ data }">
      {{ data?.tipoSujeto }}
    </template>
  </Column>
  <Column header="RPA">
    <template #body="{ data }">
      {{ data?.RPA }}
    </template>
  </Column>
  <Column header="Asiste">
    <template #body="{ data }">
      {{ data?.Asiste }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data?.Estado }}
    </template>
  </Column>
  <Column header="Fecha/Hora Citación">
    <template #body="{ data }">
      {{ data?.fechaCreacion }}
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
