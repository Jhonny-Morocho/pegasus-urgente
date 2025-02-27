<template>
<AppDataTable
  id="tabla-especies-dineros"
  v-bind="$attrs"
  class="col-12"
>
  <Column header="Familia Especie">
    <template #body="{ data }">
      {{ familiaEspecie(data.familiaEspecie) ?? 'No definido' }}
    </template>
  </Column>
  <Column header="Tipo Especie">
    <template #body="{ data }">
      {{ tipoEspecie(data.idTipoEspecie) ?? 'No definido' }}
    </template>
  </Column>
  <Column header="Descripción">
    <template #body="{ data }">
      {{ data?.descripcion }}
    </template>
  </Column>
  <Column header="Estado de la especie">
    <template #body="{ data }">
      {{ data?.estadoEspecie }}
    </template>
  </Column>
  <Column header="Observaciones">
    <template #body="{ data }">
      {{ data?.observacion || 'N/A' }}
    </template>
  </Column>
  <Column header="Cantidad">
    <template #body="{ data }">
      {{ data?.cantidadEspecie }}
    </template>
  </Column>
  <Column header="Ubicación Física">
    <template #body="{ data }">
      {{ data?.ubicacionFisica }}
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { useMantenedorStore } from '@/modules/global/composables/'
import { requestUtil } from '@/utils'

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie
} = useMantenedorStore()

function familiaEspecie (idFamiliaEspecie) {
  console.log(idFamiliaEspecie)
  if (idFamiliaEspecie) {
    return mantenedor_getNombreFamiliaEspecie(idFamiliaEspecie)
  }
  return 'Sin Familia'
}

function tipoEspecie (idTipoEspecie) {
  requestUtil({
    action: mantenedor_getAllTiposEspecie
  })
  return mantenedor_getNombreTipoEspecie(idTipoEspecie)
}
</script>
