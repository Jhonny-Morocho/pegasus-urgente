<template>
<section class="px-2 py-3 w-full">
  <AppDataTable
    class="editable-cells-table"
    edit-mode="cell"
    v-bind="{ ...$attrs }"
  >
    <Column
      v-if="selectable"
      header-style="width: 3em"
      selection-mode="multiple"
    />
    <Column header="Familia Especie">
      <template #body="{ data }">
        {{ mantenedor_getNombreFamiliaEspecie(data?.familiaEspecie) }}
      </template>
    </Column>
    <Column header="Tipo Especie">
      <template #body="{ data }">
        {{ mantenedor_getNombreTipoEspecie(data?.idTipoEspecie) }}
      </template>
    </Column>
    <Column header="Descripción">
      <template #body="{ data }">
        {{ data?.descripcion }}
      </template>
    </Column>
    <Column header="Estado Especie">
      <template #body>
        {{ 'Estado' }}
      </template>
    </Column>
    <Column
      field="observacion"
      header="Observaciónes"
    />
    <Column header="Cantidad">
      <template #body="{ data }">
        {{ data?.cantidadEspecie }}
      </template>
    </Column>
    <Column header="Ubicación Física">
      <template #body="{ data }">
        {{ data?.motivoEspecie }}
      </template>
    </Column>
    <Column
      v-if="!readOnly"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="especieSeleccionada"
          :menu-options="acciones"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { defineProps, onMounted, ref, defineEmits } from 'vue'
import { requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'

defineProps({
  selectable: Boolean,
  readOnly: Boolean
})

const emit = defineEmits(['solicitar-salida-audiencia', 'solicitar-peritaje'])

const especieSeleccionada = ref()

const acciones = ref([
  {
    items: [
      {
        label: 'Solicitar Salida Audiencia',
        command: () => emit('solicitar-salida-audiencia', especieSeleccionada.value)
      },

      {
        label: 'Peritaje',
        command: () => emit('solicitar-peritaje', especieSeleccionada.value)
      }
    ]
  }
])

const { mantenedor_getFamiliaEspecies, mantenedor_getAllTiposEspecie, mantenedor_getAmbitoEspecie, mantenedor_getNombreFamiliaEspecie, mantenedor_getNombreTipoEspecie } = useMantenedorStore()

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getFamiliaEspecies })
  requestUtil({ action: mantenedor_getAllTiposEspecie })
  requestUtil({ action: mantenedor_getAmbitoEspecie })
}
onMounted(() => {
  getDataMantenedor()
})
</script>
<style scoped>
.dropdownDatatable {
  padding: 0.75rem !important;
}
</style>
