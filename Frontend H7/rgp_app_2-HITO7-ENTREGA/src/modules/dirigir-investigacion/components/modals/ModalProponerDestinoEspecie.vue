<template>
<hr>
<section class="px-2 py-3 w-full">
  <AppFieldset legend="Especies/Dinero">
    <AppDataTable
      class="editable-cells-table"
      edit-mode="cell"
      :value="especiesDinero"
      @cell-edit-complete="onCellEditComplete"
    >
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
      <Column header="Motivo Especie">
        <template #body="{ data }">
          {{ data?.motivoEspecie }}
        </template>
      </Column>
      <Column header="Cantidad">
        <template #body="{ data }">
          {{ data?.cantidad }}
        </template>
      </Column>
      <Column header="Descripción">
        <template #body="{ data }">
          {{ data?.descripcion }}
        </template>
      </Column>
      <Column header="Ubicación Física">
        <template #body="{ data }">
          {{ data?.ubicacion }}
        </template>
      </Column>
      <Column header="Especie Peligrosa">
        <template #body="{ data }">
          {{ data?.especiePeligrosa }}
        </template>
      </Column>
      <Column header="Evidencia">
        <template #body="{ data }">
          {{ data?.evidencia }}
        </template>
      </Column>
      <Column
        class="capitalize"
        field="destino"
        header="Definir Destino"
        style="min-width: 150px"
      >
        <template #editor="slotProps">
          <Dropdown
            v-model="slotProps.data['destino']"
            class="my-0"
            option-label="descripcion"
            option-value="id"
            :options="destinosEspecie"
            placeholder="Seleccionar"
          />
        </template>
        <template #body="{ data }">
          <div class="dropdownDatatable flex flex-row md:flex-row justify-content-between">
            <span>{{ data?.destino }} </span>
            <i
              class="pi pi-chevron-down"
              style="color: darkgrey; margin-bottom: 3px;"
            />
          </div>
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</section>
</template>
<script setup>
import { defineExpose, defineProps, ref } from 'vue'
import { propTypes } from '@/modules/common/types'

const props = defineProps({
  especies: propTypes.array
})

const especiesDinero = ref(props.especies)

function onCellEditComplete (event) {
  const { data, newValue, field } = event

  data[field] = newValue
}

function retrieveData (retrieveCb) {
  const destinoEspecies = especiesDinero.value?.map((e) => {
    return {
      idEspecie: e.idEspecie,
      destino: e.destino
    }
  })
  retrieveCb?.(destinoEspecies)
}

defineExpose({ retrieveData })

const destinosEspecie = [
  { id: 'devolver', descripcion: 'Devolver' },
  { id: 'mantener', descripcion: 'Mantener' },
  { id: 'destruir', descripcion: 'Destruir' }
]

</script>
