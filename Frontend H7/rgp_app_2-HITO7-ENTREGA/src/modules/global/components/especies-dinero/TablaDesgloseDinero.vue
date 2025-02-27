<template>
<section class="col-12 px-0">
  <AppDataTable
    id="tabla-dineros"
    class="col-12"
    :loading="loadingTablaDinero"
    responsive-layout="stack"
    :value="desgloseDinero"
  >
    <Column header="Denominación">
      <template #body="{ data }">
        {{ denominacionNombre(data.denominacion) }}
      </template>
    </Column>
    <Column header="Tipo">
      <template #body="{ data }">
        {{ tipoDineroNombre(data.tipo) }}
      </template>
    </Column>
    <Column header="Desglose Cantidad">
      <template #body="{ data }">
        {{ data.cantidadDinero }}
      </template>
    </Column>
    <Column header="Total">
      <template #body="{ data }">
        {{ data.total }}
      </template>
    </Column>
    <Column
      v-if="!editando"
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
    ref="menuAcciones"
    :model="menuAccionesItems"
    :popup="true"
  />
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { ref, defineProps } from 'vue'

defineProps({
  desgloseDinero: propTypes.array
})

const loadingTablaDinero = ref(false)

function handleEditarDinero (data) {
  console.log(data)
}

function handleEliminarDinero (data) {
  console.log(data)
}

const menuAccionesItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-pencil',
        label: 'Modificar',
        command: () => handleEditarDinero(dataDinero)
      },
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Eliminar',
        command: () => handleEliminarDinero(dataDinero)
      }
    ]
  }
])

const menuAcciones = ref()
const dataDinero = ref()

</script>
