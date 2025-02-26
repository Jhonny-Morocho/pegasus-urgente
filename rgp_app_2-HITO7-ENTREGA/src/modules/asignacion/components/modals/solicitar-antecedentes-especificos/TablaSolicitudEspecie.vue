<template>
<section class="w-full">
  <AppDataTable v-bind="$attrs">
    <Column
      class="text-center"
      header="Seleccionar"
      selection-mode="single"
    />
    <Column header="Familia Especie">
      <template #body="{data}">
        {{ familiaEspecie(data?.familiaEspecie) ?? 'No esta el id en el mantenedor' }}
      </template>
    </Column>
    <Column header="Tipo Especie">
      <template #body="{data}">
        {{ tipoEspecie(data?.idTipoEspecie) ?? data.idTipoEspecie }}
      </template>
    </Column>
    <Column header="Motivo de Especie">
      <template #body="{data}">
        {{ ambitoEspecie(data?.ambitoEspecie) }}
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
    <Column header="Cantidad">
      <template #body="{ data }">
        {{ data?.cantidadEspecie }}
      </template>
    </Column>
    <Column
      header="Delito Asociado"
      hidden
    >
      <template #body="{ data }">
        {{ data?.delitoAsociado }}
      </template>
    </Column>
    <Column
      header="Lugar Almacenamiento"
      hidden
    >
      <template #body="{ data }">
        {{ data?.lugarAlmacenamiento }}
      </template>
    </Column>
  </AppDataTable>
</section>
</template>
<script setup>
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getNombreAmbitoEspecie,
  mantenedor_getAllTiposEspecie
} = useMantenedorStore()

function familiaEspecie (idFamiliaEspecie) {
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

function ambitoEspecie (idAmbito) {
  return mantenedor_getNombreAmbitoEspecie(idAmbito) ?? 'Sin Ambito' // llegan ambitos con 0
}
</script>
