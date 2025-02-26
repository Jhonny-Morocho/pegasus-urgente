<template>
<AppDataTable
  id="destinoEspeciesCausa"
  breakpoint="960px"
  class="w-full"
  responsive-layout="stack"
  v-bind="$attrs"
>
  <Column
    header="Familia Especie"
  >
    <template #body="{ data }">
      {{ familiaEspecie(data.familiaEspecie) }}
    </template>
  </Column>
  <Column
    header="Tipo Especie"
  >
    <template #body="{ data }">
      {{ tipoEspecie(data.idTipoEspecie) }}
    </template>
  </Column>
  <Column header="Descripción">
    <template #body="{ data }">
      {{ data.descripcion }}
    </template>
  </Column>
  <Column
    header="Ambito de la Especie"
  >
    <template #body="{ data }">
      {{ ambito(data.ambitoEspecie) }}
    </template>
  </Column>
  <Column
    header="Lugar de Almacenamiento"
  >
    <template #body="{ data }">
      {{ data.lugarAlmacenamiento || 'Sin definir' }}
    </template>
  </Column>
  <Column
    header="Cantidad"
  >
    <template #body="{ data }">
      {{ data.cantidadEspecie }}
    </template>
  </Column>
  <Column
    header="Indicador de Evidencia"
  >
    <template #body="{ data }">
      {{ data.indicadorEvidencia? 'Si' : 'No' }}
    </template>
  </Column>
  <Column
    header="Delito Asociado"
  >
    <template #body="{ data }">
      {{ data.delitoAsociado || 'Sin Delito Asociado' }}
    </template>
  </Column>
  <Column
    header="Destino"
  >
    <template #body="{ data }">
      {{ data.destino || 'Sin Definir' }}
    </template>
  </Column>
  <Column
    header="Motivo"
  >
    <template #body="{ data }">
      {{ data.motivo || 'Sin Motivo' }}
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="{ data }">
      <Button
        class="p-button-rounded p-button-warning p-button-outlined mr-2"
        disabled
        icon="pi pi-pencil"
        @click="emitCompletarInfo(data)"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { useMantenedorStore } from '@/modules/global/composables'
import { defineEmits, onMounted } from 'vue'
import { requestUtil } from '@/utils'

const emit = defineEmits(['action:proponer-destino'])

function emitCompletarInfo (especie) {
  emit('action:proponer-destino', especie)
}

onMounted(() => {
  getTiposFamiliasDelitoEspecies()
})

const {
  mantenedor_getFamiliaEspecies,
  mantenedor_getAllTiposEspecie,
  mantenedor_getTiposDelito,
  mantenedor_getFamiliasDelito,
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getDescripcionTipoEspecie
} = useMantenedorStore()

function getTiposFamiliasDelitoEspecies () {
  requestUtil({ action: mantenedor_getTiposDelito })
  requestUtil({ action: mantenedor_getFamiliasDelito })
  requestUtil({ action: mantenedor_getAllTiposEspecie })
  requestUtil({ action: mantenedor_getFamiliaEspecies })
}

function familiaEspecie (idFamiliaEspecie) {
  return mantenedor_getNombreFamiliaEspecie(idFamiliaEspecie) || 'Sin Familia'
}
function tipoEspecie (idTipoEspecie) {
  return mantenedor_getDescripcionTipoEspecie(idTipoEspecie) || 'Sin Tipo'
}

function ambito (id) {
  switch (id) {
    case '0':
      return 'Entrega Voluntaria'
    case '1':
      return 'Evidencia levantada por policía'
    case '2':
      return 'Incautada con autorización judicial'
    case '3':
      return 'Sustraída (robada, hurtada, apropiada)'
  }
}

</script>
