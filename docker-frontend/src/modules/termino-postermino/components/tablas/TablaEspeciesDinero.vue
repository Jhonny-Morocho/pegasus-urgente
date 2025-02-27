<template>
<hr>
<section class="px-2 py-3 w-full">
  <AppDataTable
    class="editable-cells-table"
    edit-mode="cell"
    v-bind="{ ...$attrs }"
    @cell-edit-complete="onCellEditComplete"
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
    <Column header="Estado Especie">
      <template #body="{ data }">
        {{ data?.estadoEspecie }}
      </template>
    </Column>
    <Column header="RUE">
      <template #body="{ data }">
        {{ data?.rue }}
      </template>
    </Column>
    <Column header="Ámbito Especie">
      <template #body="{ data }">
        {{ mantenedor_getNombreAmbitoEspecie(data?.ambitoEspecie) }}
      </template>
    </Column>
    <Column header="Cantidad">
      <template #body="{ data }">
        {{ data?.cantidadEspecie }}
      </template>
    </Column>
    <Column header="Descripción">
      <template #body="{ data }">
        {{ data?.descripcion }}
      </template>
    </Column>
    <Column header="Ubicación Física">
      <template #body="{ data }">
        {{ data?.motivoEspecie }}
      </template>
    </Column>
    <Column header="Evidencia">
      <template #body="{ data }">
        {{ data?.indicadorEvidencia ? 'Si' : 'No' }}
      </template>
    </Column>
    <Column header="Usada para Delito">
      <template #body="{ data }">
        {{ data?.indicadorMedioUsadoCometerDelito ? 'Si' : 'No' }}
      </template>
    </Column>
    <Column
      class="capitalize p-0"
      field="destino"
      header="Destino"
      style="min-width: 150px"
    >
      <template #editor="slotProps">
        <Dropdown
          v-model="slotProps.data['destino']"
          class="my-0 dropdown w-full"
          option-label="descripcion"
          option-value="id"
          :options="destinosEspecie"
          placeholder="Seleccionar"
        />
      </template>
      <template #body="{ data }">
        <div class="dropdownDatatable flex flex-row md:flex-row justify-content-between p-2">
          <span>{{ data?.destino || 'Definir destino...' }} </span>
          <i
            class="pi pi-chevron-down"
            style="color: darkgrey; margin-bottom: 3px"
          />
        </div>
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { defineProps, onMounted } from 'vue'
import { requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'

defineProps({
  selectable: Boolean,
  definirNuevaCausa: Boolean
})

function onCellEditComplete (event) {
  const { data, newValue, field } = event

  data[field] = newValue
}

const destinosEspecie = [
  { id: 'devolver', descripcion: 'Devolver' },
  { id: 'mantener', descripcion: 'Mantener' },
  { id: 'destruir', descripcion: 'Destruir' }
]

const { mantenedor_getFamiliaEspecies, mantenedor_getAllTiposEspecie, mantenedor_getAmbitoEspecie, mantenedor_getNombreFamiliaEspecie, mantenedor_getNombreTipoEspecie, mantenedor_getNombreAmbitoEspecie } = useMantenedorStore()

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
