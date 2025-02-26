<template>
<AppDataTable
  v-bind="$attrs"
  id="tabla-especies"
  class="w-full"
>
  <Column header="Ámbito">
    <template #body="{ data }">
      {{ ambito(data?.ambitoEspecie) || 'N/A' }}
    </template>
  </Column>
  <Column header="NUE">
    <template #body="{ data }">
      {{ data?.nue }}
    </template>
  </Column>
  <Column header="RUE">
    <template #body="{ data }">
      {{ data?.rue }}
    </template>
  </Column>
  <Column header="Familia Especie">
    <template #body="{ data }">
      {{ familiaEspecie(data?.familiaEspecie) }}
    </template>
  </Column>
  <Column header="Tipo Especie">
    <template #body="{ data }">
      {{ tipoEspecie(data?.idTipoEspecie) }}
    </template>
  </Column>
  <Column header="Descripción">
    <template #body="{ data }">
      {{ data?.descripcion }}
    </template>
  </Column>
  <Column
    header="Estado"
    hidden
  >
    <template #body="{ data }">
      {{ (data?.estadoEspecie) }}
    </template>
  </Column>
  <Column header="Ubicación">
    <template #body="{ data }">
      {{ data?.ubicacion || 'Sin ubicación Establecida' }}
    </template>
  </Column>
  <Column header="Cantidad">
    <template #body="{ data }">
      {{ data?.cantidadEspecie }}
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="slotProps">
      <AppMenuOptions
        v-model="selected"
        :menu-options="menuOptions"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, defineEmits } from 'vue'
import { requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'

const emit = defineEmits([
  'ver-registro-especie',
  'ver-cadena-custodia'
])

const selected = ref()

const {
  mantenedor_getNombreAmbitoEspecie,
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie
} = useMantenedorStore()

function ambito (idAmbito) {
  return mantenedor_getNombreAmbitoEspecie(idAmbito)
}

function familiaEspecie (idFamiliaEspecie) {
  return mantenedor_getNombreFamiliaEspecie(idFamiliaEspecie)
}

requestUtil({
  action: mantenedor_getAllTiposEspecie
})

function tipoEspecie (idTipoEspecie) {
  return mantenedor_getNombreTipoEspecie(idTipoEspecie)
}

const menuOptions = ref([
  {
    label: 'Registro de Especie',
    command: () => emit('ver-registro-especie', selected.value)
  },
  {
    label: 'Cadena de Custodia',
    command: () => emit('ver-cadena-custodia', selected.value),
    disabled: () => true
  }
])

</script>
