<template>
<div class="col-12">
  <AppDataTable
    id="tabla-delitos"
    class="col-12"
    :loading="isLoadingTable"
    :value="dataDelitos"
    v-bind="{ ...$attrs }"
  >
    <Column header="Nombre de la Tarea">
      <template #body="{ data }">
        {{ data?.institucion }}
      </template>
    </Column>
    <Column header="N° de intentos">
      <template #body="{ data }">
        {{ data?.folio }}
      </template>
    </Column>
    <Column header="RUC">
      <template #body="{ data }">
        {{ data?.ruc }}
      </template>
    </Column>
    <Column header="Código de error">
      <template #body="{ data }">
        {{ data?.delito }}
      </template>
    </Column>
    <Column header="Mensaje de error">
      <template #body="{ data }">
        {{ data?.delito }}
      </template>
    </Column>
    <Column header="CRR">
      <template #body="{ data }">
        {{ data?.detenidos }}
      </template>
    </Column>
    <Column header="Documento">
      <template #body="{ data }">
        {{ data?.detenidos }}
      </template>
    </Column>
    <Column header="Fecha/Hora de Envío">
      <template #body="{ data }">
        {{ data?.detenidos }}
      </template>
    </Column>
    <Column
      v-if="!readOnly"
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
    ref="menuConexionesPJUD"
    :model="menuConexionesPJUDItems"
    :popup="true"
  />
</div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const menuConexionesPJUD = ref()
const conexionSeleccionada = ref({})

const emit = defineEmits(['modificar', 'eliminar'])

function toggleAcciones (event, data) {
  conexionSeleccionada.value = data
  menuConexionesPJUD.value.toggle(event)
}

const menuConexionesPJUDItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-pencil',
        label: 'Modificar',
        command: () => emit('modificar', conexionSeleccionada.value)
      },
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Eliminar',
        command: () => emit('eliminar', conexionSeleccionada.value)
      }
    ]
  }
])
</script>
