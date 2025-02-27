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
      field="item"
      header="ITEM"
    />
    <Column header="REGISTRO FISCAL">
      <template #body="{ data }">
        <span v-if="data?.registro">Si</span>
        <span v-if="data?.registro === false">No</span>
        <span v-if="data?.registro === null">------</span>
      </template>
    </Column>
    <Column header="ACTA DE AUDIENCIA">
      <template #body="{ data }">
        <span v-if="data?.actaAudiencia">Si</span>
        <span v-if="data?.actaAudiencia === false">No</span>
        <span v-if="data?.actaAudiencia === null">------</span>
      </template>
    </Column>
    <Column header="COMPARA">
      <template #body="{ data }">
        <i
          v-if="data?.resultado"
          class="pi pi-check text-xl text-green-600 font-bold"
        />
        <i
          v-if="data?.resultado === false"
          class="pi pi-times text-xl text-red-600 font-bold"
        />
        <span v-if="data?.resultado === null">------</span>
      </template>
    </Column>
    <Column
      class="capitalize p-0"
      field="resultado"
      header="RESULTADO AUDIENCIA"
      style="max-width: 100px"
    >
      <template #editor="{ data }">
        <Dropdown
          v-model="data['resultado']"
          class="my-0 dropdown w-full"
          option-label="descripcion"
          option-value="value"
          :options="resultadosOptions"
          placeholder="Seleccionar"
        />
      </template>
      <template #body="{ data }">
        <div class="dropdownDatatable flex flex-row md:flex-row justify-content-between p-2">
          <span>{{ data?.resultado === null ? 'Definir (*)' : data?.resultado === true ? 'Si' : 'No' }} </span>
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
  console.log({ data })
}

const resultadosOptions = [
  { value: true, descripcion: 'Si' },
  { value: false, descripcion: 'No' }
]
</script>
<style scoped>
.dropdownDatatable {
  padding: 0.75rem !important;
}
</style>
