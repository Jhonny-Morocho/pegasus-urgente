<template>
<AppDataTable
  v-bind="$attrs"
  id="tabla-anotaciones"
  class="w-full"
>
  <Column header="RUC">
    <template #body="{ data }">
      {{ data?.ambito }}
    </template>
  </Column>
  <Column header="Nombre Causa">
    <template #body="{ data }">
      {{ data?.ambito }}
    </template>
  </Column>
  <Column header="Alertas">
    <template #body="{ data }">
      {{ data?.ambito }}
    </template>
  </Column>
  <Column header="Fecha Agrupación">
    <template #body="{ data }">
      {{ data?.ambito }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data?.ambito }}
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="slotProps">
      <AppMenuOptions
        v-model="selected"
        :menu-options="menuOptions"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { ref } from 'vue'

const selected = ref()

const menuOptions = ref([
  {
    label: 'Ver Ficha Causa',
    // PENDIENTE HASTA QUE HAYA ENDPOINT Y REGRESE LOS DATOS NECESARIOS
    command: () => console.log('VER FICHA CAUSA')
  }
])
</script>
