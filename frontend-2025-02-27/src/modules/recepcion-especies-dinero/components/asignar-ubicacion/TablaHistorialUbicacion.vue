<template>
<AppDataTable
  id="tablaHistorialUbicacion"
  class="col-12"
  :total-records="disponibilidades?.length"
  :value="disponibilidades"
>
  <Column header="Bodega">
    <template #body="slotProps">
      <span v-if="slotProps.data.nombreBodega">
        {{ slotProps.data.nombreBodega }}
      </span>
      <span v-else>Sin nombre</span>
    </template>
  </Column>
  <Column header="Sector">
    <template #body="slotProps">
      <span v-if="slotProps.data.nombreSector">
        {{ slotProps.data.nombreSector }}
      </span>
      <span v-else>Sin nombre</span>
    </template>
  </Column>
  <Column header="Casillero">
    <template #body="slotProps">
      <span v-if="slotProps.data.nombreCasillero">
        {{ slotProps.data.nombreCasillero }}
      </span>
      <span v-else>Sin descripción</span>
    </template>
  </Column>
  <Column header="Estado del Casillero">
    <template #body="slotProps">
      <span
        v-if="slotProps.data.tieneEspacio"
        class="colorIconConEspacio"
      >
        <i
          class="pi pi-unlock mx-2 colorIconConEspacio"
        />(Con espacio)</span>
      <span
        v-else
        class="colorIconLleno"
      >
        <i
          class="pi pi-lock mx-2 colorIconLleno"
        />
        (Lleno)</span>
    </template>
  </Column>
  <Column
    class="text-center"
    header="Acciones"
    style="width: 0"
  >
    <template #body="slotProps">
      <AppMenuOptions
        v-model="tareaSeleccionada"
        :menu-options="acciones"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { ref, defineEmits, defineProps } from 'vue'

const tareaSeleccionada = ref('')

const emit = defineEmits(['ver-rues', 'seleccionar-ubicacion'])

const acciones = ref([
  {
    items: [
      {
        label: `Ver RUE'S que utilizan el casillero`,
        command: () => emit('ver-rues', tareaSeleccionada.value)
      },
      {
        label: 'Seleccionar Ubicación',
        command: () => {
          emit('seleccionar-ubicacion', tareaSeleccionada.value)
        },
        disabled: () => {
          return tareaSeleccionada.value?.tieneEspacio === false
        }
      }
    ]
  }
])

defineProps({
  disponibilidades: propTypes.array
})
</script>
<style scoped>
.colorIconLleno{
  color: brown;
  font-weight: bold;
  font-size: 1.2rem;
}
.colorIconConEspacio{
  color: green;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>
