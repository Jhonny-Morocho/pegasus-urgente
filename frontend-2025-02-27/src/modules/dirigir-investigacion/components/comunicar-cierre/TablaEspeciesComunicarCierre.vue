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
        {{ data?.familiaEspecie }}
      </template>
    </Column>
    <Column header="Tipo Especie">
      <template #body="{ data }">
        {{ data?.tipoEspecie }}
      </template>
    </Column>
    <Column header="Descripción">
      <template #body="{ data }">
        {{ data?.descripcion }}
      </template>
    </Column>
    <Column header="Estado">
      <template #body="{ data }">
        {{ data?.estado }}
      </template>
    </Column>
    <Column header="Observaciones">
      <template #body="{ data }">
        {{ data?.observaciones }}
      </template>
    </Column>

    <Column header="Cantidad">
      <template #body="{ data }">
        {{ data?.cantidad }}
      </template>
    </Column>
    <Column header="Ubicación">
      <template #body="{ data }">
        {{ data?.ubicacionFisica }}
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
          <span>{{ data?.destino || 'Sin definir' }} </span>
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
import { defineProps } from 'vue'

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
</script>

<style scoped>
.dropdownDatatable {
  padding: 0.75rem !important;
}
</style>
