<template>
<div :class="modal ? 'md:col-6 my-0 py-0' : 'col-12 md:col-6 lg:col-4 my-0'">
  <p class="w-full my-3">
    <span>NUE:</span>{{ especie?.nue }}
  </p>
  <p class="w-full my-3">
    <span>RUE:</span>{{ especie?.rue }}
  </p>
  <p
    v-if="!revisionInstruccion"
    class="w-full mt-3 mb-0"
  >
    <span>RUC:</span>{{ especie?.ruc }}
  </p>
  <p
    v-if="modal"
    class="w-full my-3"
  >
    <span>Fiscalía Regional:</span>{{ especie?.fiscaliaRegional }}
  </p>
  <p
    v-if="modal"
    class="w-full my-3"
  >
    <span>Fiscalía Local:</span>{{ especie?.fiscaliaLocal }}
  </p>
</div>
<div :class="modal ? 'md:col-6':'col-12  md:col-6 lg:col-4 my-0'">
  <p class="w-full my-3">
    <span>Familia Especie:</span>{{ mantenedor_getNombreFamiliaEspecie(especie?.familiaEspecie) }}
  </p>
  <p class="w-full my-3">
    <span>Tipo Especie:</span>{{ tipoEspecie(especie?.idTipoEspecie) }}
  </p>
  <p class="w-full mt-3 mb-0">
    <span>Marca:</span>{{ especie?.esPeligrosa ? "Especie Peligrosa" : "Especie" }}
  </p>
  <p
    v-if="modal"
    class="w-full my-3"
  >
    <span>Fecha Recepción:</span>{{ formatDate(especie?.fechaRecepcion) }}
  </p>
</div>
<div :class="modal ? 'md:col-6 my-0 py-0': 'col-12 md:col-6 lg:col-4 my-0'">
  <p class="w-full my-3">
    <span>Bodega:</span>{{ especie?.nombreBodega }}
  </p>
  <p class="w-full my-3">
    <span>Sector:</span>{{ especie?.nombreSector }}
  </p>
  <p class="w-full mt-3 mb-0">
    <span>Casillero:</span>{{ especie?.nombreCasillero }}
  </p>
  <p
    v-if="modal"
    class="w-full my-3"
  >
    <span>Fecha Ingreso:</span>{{ formatDate(especie?.fechaIngreso) }}
  </p>
</div>
<div class="col-12 grid">
  <p :class="revisionInstruccion ? 'col-4': 'col-12'">
    <span>Descripción:</span>{{ especie?.descripcion }}
  </p>
  <p
    v-if="revisionInstruccion"
    class="col-4"
  >
    <span>Observación:</span>{{ especie?.observacion }}
  </p>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { defineProps } from 'vue'
import { requestUtil, dateTimeUtil } from '@/utils'

defineProps({
  especie: propTypes.object,
  masData: propTypes.object,
  modal: {
    type: Boolean,
    default: () => false
  },
  revisionInstruccion: {
    type: Boolean,
    default: () => false
  }
})
const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie
} = useMantenedorStore()

function tipoEspecie (idTipoEspecie) {
  requestUtil({
    action: mantenedor_getAllTiposEspecie
  })
  return mantenedor_getNombreTipoEspecie(idTipoEspecie)
}
function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
</script>

<style scoped>
span {
  font-weight: bold;
  margin-right: 6px;
}
</style>
