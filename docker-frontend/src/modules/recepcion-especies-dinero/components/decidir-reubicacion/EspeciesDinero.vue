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
    v-if="especiesDineros.comprobante"
    header="NUE"
  >
    <template #body="slotProps">
      {{ slotProps.data.nue }}
    </template>
  </Column>
  <Column header="RUE">
    <template #body="slotProps">
      {{ slotProps.data.rue }}
    </template>
  </Column>
  <Column header="Familia Especie">
    <template #body="slotProps">
      {{ slotProps.data.familiaEspecie }}
    </template>
  </Column>
  <Column header="Tipo Especie">
    <template #body="slotProps">
      {{ slotProps.data.tipoEspecie }}
    </template>
  </Column>
  <Column header="Descripción">
    <template #body="slotProps">
      {{ slotProps.data.descripcion }}
    </template>
  </Column>
  <Column
    v-if="!especiesDineros.comprobante"
    :header="especiesDineros.etiqueta ? 'Marca' : 'Alerta'"
  >
    <template #body="slotProps">
      {{ slotProps.data.alerta ? 'Especie Peligrosa' : 'Especie' }}
    </template>
  </Column>
  <Column header="Cantidad/Monto">
    <template #body="slotProps">
      {{ slotProps.data.cantidadMonto }}
    </template>
  </Column>
  <Column
    v-if="!especiesDineros.comprobante"
    header="Observaciones"
  >
    <template #body="slotProps">
      {{ slotProps.data.observaciones }}
    </template>
  </Column>
  <Column
    v-if="!especiesDineros.comprobante"
    header="Bodega"
  >
    <template #body="slotProps">
      {{ slotProps.data.bodega }}
    </template>
  </Column>
  <Column
    v-if="!especiesDineros.comprobante"
    header="Sector"
  >
    <template #body="slotProps">
      {{ slotProps.data.sector }}
    </template>
  </Column>
  <Column
    v-if="!especiesDineros.comprobante"
    header="Casillero"
  >
    <template #body="slotProps">
      {{ slotProps.data.casillero }}
    </template>
  </Column>
  <Column
    v-if="!especiesDineros.comprobante && !especiesDineros.etiqueta"
    header="Imágenes"
  >
    <template #body="slotProps">
      <i
        v-if="slotProps.data?.refFotografias?.length > 0"
        class="pi pi-images link"
        style="font-size: 2em"
        @click="verImagenes(slotProps.data?.refFotografias)"
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
import { computed, defineProps } from 'vue'

const props = defineProps({
  especiesDineros: propTypes.object
})

const arrayEspeciesDineros = computed(() => props.especiesDineros.especiesDineros.map((e) => {
  return {
    ...e,
    nue: props.especiesDineros.nue
  }
}))
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
