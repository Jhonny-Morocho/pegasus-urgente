<template>
<section class="col-12">
  <AppDataTable
    id="dataTableReferencial"
    v-bind="{ ...$attrs }"
    :lazy="true"
  >
    <Column header="Referencial">
      <template #body="{ data }">
        {{ data.nombrePersonaReferencial ?? "Sin Referencial" }}
      </template>
    </Column>
    <Column header="Parentesco">
      <template #body="{ data }">
        {{ mantenedor_getDescripcionRelacionSujetosById(data.idTipo) ?? "Sin Información" }}
      </template>
    </Column>
    <Column header="Referenciado">
      <template #body="{ data }">
        {{ data.nombrePersonaReferenciada ?? "Sin Referenciado" }}
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
    ref="menuParentesco"
    :model=" menuParentescoItems"
    :popup="true"
  />
</section>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'

const props = defineProps({
  isEditando: Boolean,
  readOnly: Boolean,
  esFichaCausa: Boolean,
  isDisabled: { type: Boolean, default: false }

})

const { mantenedor_getDescripcionRelacionSujetosById } = useMantenedorStore()

const emit = defineEmits([
  'parentesco:editarParentesco',
  'parentesco:eliminarParentesco'
])

const parentescoSeleccionada = ref({})

function toggleAcciones (event, data) {
  menuParentesco.value.toggle(event)
  parentescoSeleccionada.value = data
}

const menuParentesco = ref()
const menuParentescoItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-pencil',
        label: 'Modificar',
        command: () =>
          emit('parentesco:editarParentesco', parentescoSeleccionada.value),
        disabled: props.isDisabled
      },
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Eliminar',
        command: () =>
          emit('parentesco:eliminarParentesco', parentescoSeleccionada.value),
        disabled: props.isDisabled
      }
    ]
  }
])
</script>
