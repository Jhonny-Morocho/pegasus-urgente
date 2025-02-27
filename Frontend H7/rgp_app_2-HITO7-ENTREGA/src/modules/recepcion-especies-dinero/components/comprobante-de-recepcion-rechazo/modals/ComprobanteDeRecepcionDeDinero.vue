<template>
<section>
  <hr class="">
  <div class="grid col-12">
    <div class="grid col-12 md:col-6 pl-4">
      <h3 class="col-12 my-2">
        Institución que entrega: {{ dataQuienRecibe.institucion }}
      </h3>
      <h3 class="col-12 my-2">
        Unidad: {{ dataQuienRecibe.unidad }}
      </h3>
      <h3 class="col-12 my-2">
        Destacamento: {{ dataQuienRecibe.institucion }}
      </h3>
      <h3 class="col-12 my-2">
        Nombre quien Entrega: {{ dataQuienRecibe.nombre }}
      </h3>
      <h3 class="col-12 my-2">
        Cargo quien entrega: {{ dataQuienRecibe.grado }}
      </h3>
      <h3 class="col-12 my-2">
        Tipo de Observación: {{ destinoDinero.tipoObservacion }}
      </h3>
    </div>
    <div class="grid col-12 md:col-6 pl-4">
      <h3 class="col-12 my-2">
        Fiscalía que Recepciona: {{ causaEncontradaAsociadaANue.causa.nombreFiscalia }}
      </h3>
      <h3 class="col-12 my-2">
        Nombre Receptor(a): {{ causaEncontradaAsociadaANue.causa.fiscalAsignado }}
      </h3>
      <h3 class="col-12 my-2">
        Cargo quien Recepciona: Custodio
      </h3>
      <h3 class="col-12 my-2">
        Fecha / Hora Recepción: {{ formatFecha(new Date()) }}
      </h3>
      <h3 class="col-12 my-2">
        RUC: {{ ruc }}
      </h3>
    </div>
    <div class="grid col-12 md:col-6 pl-4">
      <h3 class="col-12 my-4">
        Observaciónes: {{ destinoDinero.observaciones }}
      </h3>
    </div>
    <div class="col-12 mb-8">
      <TablaDinerosRecepcionados
        class="mt-3"
      />
    </div>

    <div class="  col-12 mt-8 mb-8 mx-3 flex justify-content-around">
      <div class="col-3 text-center">
        <hr>
        <h3>Firma de {{}}</h3>
      </div>
      <div class="col-3 text-center">
        <hr>
        <h3>Firma de {{}}</h3>
      </div>
    </div>
    <div class="ml-4 mt-8 mb-5 col-12">
      <Button
        class="boton p-button-raised p-button-plain px-6"
        icon="pi pi-print"
        icon-pos="right"
        label="Imprimir"
      />
    </div>
  </div>
</section>
</template>

<script setup>
// IMPORT COMPONENTS AND FUNCTIONALITIES
import { useIdentificacionNueStore } from '@/modules/recepcion-especies-dinero/composables'
import { dateTimeUtil } from '@/utils'
import TablaDinerosRecepcionados from '../TablaDinerosRecepcionados.vue'

// UTILITIES
const { causaEncontradaAsociadaANue } = useIdentificacionNueStore()
// VALUES
const dataQuienRecibe = causaEncontradaAsociadaANue.value.especiesDinero[0].dineros[0].entregadoPor[0]
const destinoDinero = causaEncontradaAsociadaANue.value.especiesDinero[0].dineros[0].destinoDinero
const ruc = causaEncontradaAsociadaANue.value.causa.ruc

// LOGIC
function formatFecha (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
</script>

<style scoped>
hr {
  margin-bottom: none;
}
.boton {
  background-color:#606E84 !important;
}
</style>
