<template>
<section class="col-12">
  <AppDataTable
    id="dataTableRelaciones"
    v-bind="{ ...$attrs }"
    :lazy="true"
    :loading="loading"
    :total-records="paginacion?.elementosTotales"
    :value="props.dataRelaciones"
  >
    <Column header="Victima(s)">
      <template #body="{ data }">
        {{ data.nombreCompletoVictima ?? "Sin Víctima" }}
      </template>
    </Column>
    <Column header="Imputado(s)">
      <template #body="{ data }">
        {{ data.nombreCompletoImputado ?? "Sin Imputado" }}
      </template>
    </Column>
    <Column header="Delito">
      <template
        #body="{ data }"
      >
        {{ data.nombreDelito ?? "Delito sin Clasificación" }}
      </template>
    </Column>
    <Column
      v-if="!readOnly && !esFichaCausa"
      class="text-center"
      header="Acciones"
      style="width: 0"
    >
      <template #body="{ data }">
        <Button
          aria-controls="overlay_menu"
          aria-haspopup="true"
          class="p-button-rounded p-button-outlined"
          icon="pi pi-ellipsis-v"
          type="button"
          @click="toggleAcciones($event, data)"
        />
      </template>
    </Column>
  </AppDataTable>
  <Menu
    id="overlay_menu"
    ref="menuRelaciones"
    :model=" menuRelacionesItems"
    :popup="true"
  />
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineEmits, defineProps, ref } from 'vue'
import { useRelacionesStore } from '@/modules/global/composables'

const { paginacion } = useRelacionesStore()

const props = defineProps({
  dataRelaciones: propTypes.array,
  isEditando: Boolean,
  readOnly: Boolean,
  loading: Boolean,
  esFichaCausa: Boolean,
  isDisabled: { type: Boolean, default: false }
})

const emit = defineEmits([
  'relacion:editarRelacion',
  'relacion:eliminarRelacion'
])

const relacionSeleccionada = ref({})

function toggleAcciones (event, data) {
  menuRelaciones.value.toggle(event)
  relacionSeleccionada.value = data
}

const menuRelaciones = ref()
const menuRelacionesItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-pencil',
        label: 'Modificar',
        command: () =>
          emit('relacion:editarRelacion', relacionSeleccionada.value),
        disabled: props.isDisabled
      },
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Eliminar',
        command: () =>
          emit('relacion:eliminarRelacion', relacionSeleccionada.value),
        disabled: props.isDisabled
      }
    ]
  }
])
</script>
