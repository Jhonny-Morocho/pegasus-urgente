<template>
<div class="col-12">
  <AppDataTable
    id="tabla-anotaciones"
    v-bind="$attrs"
  >
    <Column header="Anotación">
      <template #body="{ data }">
        <p style="word-wrap: break-word; max-width: 400px;">
          {{ data.anotacion }}
        </p>
      </template>
    </Column>
    <Column header="Usuario">
      <template #body="{ data }">
        {{ data?.rol ? `${data?.autor} - ${data?.rol}` : data?.autor }}
      </template>
    </Column>
    <Column header="Etapa">
      <template #body="{ data }">
        {{ data.etapa }}
      </template>
    </Column>
    <Column header="Fecha Actualización">
      <template #body="{ data }">
        {{ formatDate(data.fechaCreacion) }}
      </template>
    </Column>
    <Column
      v-if="!readOnly"
      class="text-center"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="anotacionSeleccionada"
          :menu-options="menuAnotacionesItems"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</div>
</template>

<script setup>
import { dateTimeUtil } from '@/utils'
import { defineEmits, defineProps, ref } from 'vue'

defineProps({
  readOnly: {
    type: Boolean,
    default: true
  }
})

function formatDate (value) {
  let fechaCreacion = value

  fechaCreacion = dateTimeUtil.addNMinutes(fechaCreacion, -180)

  return fechaCreacion
}

const emit = defineEmits(['ver-anotacion'])

const anotacionSeleccionada = ref(null)

const menuAnotacionesItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-pencil',
        label: 'Ver Anotación',
        command: () => emit('ver-anotacion', anotacionSeleccionada.value)
      }
    ]
  }
])
</script>
