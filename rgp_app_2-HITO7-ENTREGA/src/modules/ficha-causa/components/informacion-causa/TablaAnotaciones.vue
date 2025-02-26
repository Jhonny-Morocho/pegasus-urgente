<template>
<AppDataTable
  v-bind="$attrs"
  id="tabla-anotaciones"
  class="w-full"
>
  <Column header="Anotación">
    <template #body="{ data }">
      {{ data?.anotacion }}
    </template>
  </Column>
  <Column header="Usuario">
    <template #body="{ data }">
      {{ data?.autor }}
    </template>
  </Column>
  <Column header="Cargo">
    <template #body="{ data }">
      {{ data?.rol }}
    </template>
  </Column>
  <Column header="Etapa">
    <template #body="{ data }">
      {{ data?.etapa }}
    </template>
  </Column>
  <Column header="Fecha">
    <template #body="{ data }">
      {{ formatDate(data?.fechaCreacion) }}
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
import { ref, defineEmits } from 'vue'
import { dateTimeUtil } from '@/utils'

const emit = defineEmits(['ver-anotacion'])

const selected = ref()

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

const menuOptions = ref([
  {
    label: 'Ver Anotación',
    command: () => emit('ver-anotacion', selected.value)
  }
])
</script>
