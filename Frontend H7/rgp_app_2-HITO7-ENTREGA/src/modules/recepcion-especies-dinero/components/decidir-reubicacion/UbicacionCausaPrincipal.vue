<template>
<AppDataTable
  id="tabla-especies-causa"
  class="col-12"
  responsive-layout="stack"
  :value="data"
>
  <Column header="Bodega">
    <template #body="slotProps">
      {{ slotProps.data?.bodega }}
    </template>
  </Column>
  <Column header="Sector">
    <template #body="slotProps">
      {{ slotProps.data?.sector }}
    </template>
  </Column>
  <Column header="Casillero">
    <template #body="slotProps">
      {{ slotProps.data?.casillero }}
    </template>
  </Column>
  <Column
    class="text-center"
    header="Estado del Casillero"
    style="width: 0"
  >
    <template #body="slotProps">
      <i
        v-if="slotProps.data?.lleno"
        class="pi pi-lock"
        style="color: red; font-size: 2em"
      />
      <i
        v-else
        class="pi pi-unlock"
        style="color: green; font-size: 2em"
      />
    </template>
  </Column>
  <Column
    class="text-center"
    header="Acciones"
    style="width: 0"
  >
    <template #body="slotProps">
      <AppMenuOptions
        v-model="casilleroSeleccionado"
        :menu-options="acciones"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps, ref, defineEmits } from 'vue'

defineProps({
  data: propTypes.object
})

const casilleroSeleccionado = ref()

const emit = defineEmits(['ver-rues', 'seleccionar-ubicacion'])

const acciones = [
  {
    label: 'Acciones',
    items: [
      {
        label: 'Ver RUEs que utilizan el Casillero',
        command: () => {
          emit('ver-rues', casilleroSeleccionado.value)
        }
      },
      {
        label: 'Seleccionar Ubicación',
        command: () => {
          emit('seleccionar-ubicacion', casilleroSeleccionado.value)
        }
      }
    ]
  }
]
</script>
