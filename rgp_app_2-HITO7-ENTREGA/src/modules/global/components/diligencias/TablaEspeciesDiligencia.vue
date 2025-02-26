<template>
<AppDataTable
  id="tabla-especies-diligencia"
  v-bind="$attrs"
  class="col-12"
>
  <Column
    selection-mode="multiple"
  />
  <Column header="Familia Especie">
    <template #body="{ data }">
      {{ familiaEspecie(data?.idFamiliaEspecie || data?.familiaEspecie) }}
    </template>
  </Column>
  <Column header="Tipo Especie">
    <template #body="{ data }">
      {{ tipoEspecie(data?.idTipoEspecie) || data?.tipoEspecie }}
    </template>
  </Column>
  <Column header="Motivo Especie">
    <template #body="{ data }">
      {{ ambitoEspecie(data?.ambitoEspecie) || data?.estado }}
    </template>
  </Column>
  <Column header="RUE">
    <template #body="{ data }">
      {{ data?.rue }}
    </template>
  </Column>
  <Column header="NUE">
    <template #body="{ data }">
      {{ data?.nue }}
    </template>
  </Column>
  <Column
    class="text-center"
    header="Cantidad"
  >
    <template #body="{ data }">
      {{ data?.cantidadEspecie ?? 'N/A' }}
    </template>
  </Column>
  <Column header="Delito Asociado">
    <template #body="{ data }">
      {{ data?.delitoAsociado ?? 'N/A' }}
    </template>
  </Column>
  <Column header="Lugar de Almacenamiento">
    <template #body="{ data }">
      {{ data?.pronunciamientoFiscal ?? 'N/A' }}
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getDescripcionTipoEspecie,
  mantenedor_getNombreAmbitoEspecie,
  mantenedor_getFamiliaEspecies,
  mantenedor_getAllTiposEspecie
} = useMantenedorStore()

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getFamiliaEspecies })
  requestUtil({ action: mantenedor_getAllTiposEspecie })
}
getDataMantenedor()

function familiaEspecie (idFamiliaEspecie) {
  console.log(idFamiliaEspecie)
  if (idFamiliaEspecie) {
    return mantenedor_getNombreFamiliaEspecie(idFamiliaEspecie)
  }
  return 'Sin Familia'
}

function tipoEspecie (idTipoEspecie) {
  if (idTipoEspecie) {
    return mantenedor_getDescripcionTipoEspecie(idTipoEspecie)
  }
  return 'Sin Tipo'
}

function ambitoEspecie (idAmbito) {
  return mantenedor_getNombreAmbitoEspecie(idAmbito) ?? 'Sin Ambito' // llegan ambitos con 0
}
</script>
