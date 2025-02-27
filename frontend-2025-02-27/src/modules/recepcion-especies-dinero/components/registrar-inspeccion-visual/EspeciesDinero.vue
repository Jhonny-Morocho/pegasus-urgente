<template>
<div
  v-if="!especiesDineros?.comprobante"
  class="col-12"
>
  <p class="nue">
    <span>NUE:</span>{{ especiesDineros?.nue }}
  </p>
</div>
<AppDataTable
  id="especies-dinero"
  class="col-12"
  :value="arrayEspeciesDineros"
>
  <Column
    v-if="especiesDineros?.comprobante"
    header="NUE"
  >
    <template #body="slotProps">
      {{ slotProps.nue }}
    </template>
  </Column>
  <Column header="RUE">
    <template #body="slotProps">
      {{ slotProps.rue ?? slotProps.data.RUE }}
    </template>
  </Column>
  <Column header="Familia Especie">
    <template #body="slotProps">
      {{ slotProps.familiaEspecie ?? mantenedor_getNombreFamiliaEspecie(slotProps?.data.idFamilia) }}
    </template>
  </Column>
  <Column header="Tipo Especie">
    <template #body="slotProps">
      {{ slotProps.tipo ?? mantenedor_getNombreTipoEspecie(slotProps?.data.idTipoEspecie) }}
    </template>
  </Column>
  <Column header="Descripción">
    <template #body="slotProps">
      {{ slotProps.descripcion ?? slotProps?.data.descripcion }}
    </template>
  </Column>
  <Column
    v-if="!especiesDineros?.comprobante"
    :header="especiesDineros?.etiqueta ? 'Marca' : 'Alerta'"
  >
    <template #body="slotProps">
      {{ slotProps.alerta ? 'Especie Peligrosa' : 'Especie' }}
    </template>
  </Column>
  <Column header="Cantidad/Monto">
    <template #body="slotProps">
      {{ slotProps.cantidadMonto ?? slotProps?.data.cantidad }}
    </template>
  </Column>
  <Column
    v-if="!especiesDineros?.comprobante"
    header="Observaciones"
  >
    <template #body="slotProps">
      {{ slotProps.observaciones ?? slotProps?.data.observaciones }}
    </template>
  </Column>
  <Column
    v-if="!especiesDineros?.comprobante"
    header="Bodega"
  >
    <template #body="slotProps">
      {{ slotProps.bodega ?? 'N/A' }}
    </template>
  </Column>
  <Column
    v-if="!especiesDineros?.comprobante"
    header="Sector"
  >
    <template #body="slotProps">
      {{ slotProps.sector ?? 'N/A' }}
    </template>
  </Column>
  <Column
    v-if="!especiesDineros?.comprobante"
    header="Casillero"
  >
    <template #body="slotProps">
      {{ slotProps.casillero ?? 'N/A' }}
    </template>
  </Column>
  <Column
    v-if="!especiesDineros?.comprobante && !especiesDineros?.etiqueta"
    header="Imágenes"
  >
    <template #body="slotProps">
      <i
        v-if="slotProps?.refFotografias?.length > 0"
        class="pi pi-images link"
        style="font-size: 2em"
        @click="verImagenes(slotProps?.refFotografias)"
      />
      <p v-else>
        Sin imágenes
      </p>
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { defineProps, computed } from 'vue'

const props = defineProps({
  especiesDineros: propTypes.object
})

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie
} = useMantenedorStore()

const arrayEspeciesDineros = computed(() =>
  props.especiesDineros?.items?.filter((e) => e.ingresada))
</script>

<style scoped>
span {
  font-weight: bold;
  margin-right: 6px;
}
.nue {
  margin-top: 4px;
  font-size: 1.2em;
}
</style>
