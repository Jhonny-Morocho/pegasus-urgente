<template>
<div class="col-12 md:col-6 grid">
  <div class="col-6">
    NUE:
  </div>
  <div class="col-6">
    <strong>{{ props.dataEtiqueta.nue }}</strong>
  </div>
  <div class="col-6">
    RUC:
  </div>
  <div class="col-6">
    <strong>{{ props.dataEtiqueta.ruc }}</strong>
  </div>
  <div class="col-6">
    RUE:
  </div>
  <div class="col-6">
    <strong>{{ props.dataEtiqueta.RUE }}</strong>
  </div>
  <div class="col-6">
    Familia Especie:
  </div>
  <div class="col-6">
    <strong>{{ mantenedor_getNombreFamiliaEspecie(props.dataEtiqueta.idFamilia) }}</strong>
  </div>
  <div class="col-6">
    Tipo Especie:
  </div>
  <div class="col-6">
    <strong>{{ tipoEspecie(props.dataEtiqueta.idTipoEspecie) }}</strong>
  </div>
  <div class="col-6">
    Cantidad:
  </div>
  <div class="col-6">
    <strong>{{ props.dataEtiqueta.cantidad }}</strong>
  </div>
  <div class="col-6">
    Unidad de medida:
  </div>
  <div class="col-6">
    <strong>{{ props.dataEtiqueta.unidadMedidaPeso }}</strong>
  </div>
  <div class="col-6">
    Especie Peligrosa:
  </div>
  <div class="col-6">
    <strong> {{ props.dataEtiqueta.especiePeligrosa ? 'Si' : 'No' }}</strong>
  </div><div
    v-if="props.dataEtiqueta.especiePeligrosa"
    class="col-6"
  >
    Clase:
  </div>
  <div class="col-6">
    <strong>{{ mantenedor_getDescripcionClasesPeligroEspeciesById(props.dataEtiqueta.idClasePeligro) }}</strong>
  </div>
  <div
    v-if="props.dataEtiqueta.especiePeligrosa"
    class="col-6"
  >
    Peso:
  </div>
  <div class="col-6">
    <strong>{{ props.dataEtiqueta.peso }}</strong>
  </div>
</div>
<div class="col-12 md:col-6 grid">
  <div class="col-6">
    Fiscalía Regional:
  </div>
  <div class="col-6">
    <strong>hola2343</strong>
  </div>
  <div class="col-6">
    Fiscalía Local:
  </div>
  <div class="col-6">
    <strong>hola2343</strong>
  </div>
  <div class="col-6">
    Fecha de Recepción:
  </div>
  <div class="col-6">
    <strong>{{ dateTimeUtil.formatToFrontendWithTime(props.dataEtiqueta.fechaRecepcion) }}</strong>
  </div>
  <div class="col-6">
    Fecha de Ingreso:
  </div>
  <div class="col-6">
    <strong>{{ dateTimeUtil.formatToFrontendWithTime(props.dataEtiqueta.fechaIngreso) }}</strong>
  </div>
  <div class="col-6">
    Especie Digital:
  </div>
  <div class="col-6">
    <strong v-if="props.dataEtiqueta.esDigital">Si</strong>
    <strong v-else>No</strong>
  </div>
  <div class="col-6">
    Descripción:
  </div>
  <div class="col-6">
    <strong>{{ props.dataEtiqueta.descripcion }}</strong>
  </div>
  <div class="col-6">
    Bodega:
  </div>
  <div class="col-6">
    <strong>{{ props.dataEtiqueta.nombreBodega }}</strong>
  </div> <div class="col-6">
    Casillero:
  </div>
  <div class="col-6">
    <strong>{{ props.dataEtiqueta.nombreCasillero }}</strong>
  </div> <div class="col-6">
    Sector:
  </div>
  <div class="col-6">
    <strong>{{ props.dataEtiqueta.nombreSector }}</strong>
  </div>
</div>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { defineProps } from 'vue'
import { dateTimeUtil, requestUtil } from '@/utils'

const props = defineProps({
  dataEtiqueta: propTypes.object
})

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie,
  mantenedor_getDescripcionClasesPeligroEspeciesById
} = useMantenedorStore()

function tipoEspecie (idTipoEspecie) {
  requestUtil({
    action: mantenedor_getAllTiposEspecie
  })
  return mantenedor_getNombreTipoEspecie(idTipoEspecie)
}
</script>
