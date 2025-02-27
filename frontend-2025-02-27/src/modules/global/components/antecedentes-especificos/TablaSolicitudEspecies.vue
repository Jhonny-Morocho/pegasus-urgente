<template>
<AppDataTable v-bind="$attrs">
  <Column
    class="text-center"
    header="Seleccionar"
    selection-mode="single"
  />
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
  <Column header="Ámbito de Especie">
    <template #body="{ data }">
      {{ ambitoEspecie(data?.ambitoEspecie) }}
    </template>
  </Column>
  <Column header="NUE">
    <template #body="{ data }">
      {{ data?.nue }}
    </template>
  </Column>
  <Column header="Cantidad">
    <template #body="{ data }">
      {{ data?.cantidadEspecie }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { useMantenedorStore } from '../../composables'

const {
  mantenedor_getNombreTipoEspecie,
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreAmbitoEspecie
} = useMantenedorStore()

function tipoEspecie (idTipoEspecie) {
  return mantenedor_getNombreTipoEspecie(idTipoEspecie)
}
function familiaEspecie (idFamiliaEspecie) {
  return mantenedor_getNombreFamiliaEspecie(idFamiliaEspecie)
}
function ambitoEspecie (idAmbitoEspecie) {
  return mantenedor_getNombreAmbitoEspecie(idAmbitoEspecie)
}
</script>
