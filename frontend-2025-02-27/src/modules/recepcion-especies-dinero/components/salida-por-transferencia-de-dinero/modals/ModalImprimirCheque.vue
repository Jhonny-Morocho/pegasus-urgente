<template>
<hr>
<div
  class="col-12 grid"
  style="font-size:1.1em"
>
  <p class="col-12 md:col-6">
    Número de Serie:
    <span class="font-bold">
      {{ props.numeroDeSerie }}
    </span>
  </p>
  <p class="col-12 md:col-6">
    Monto total:
    <span class="font-bold">
      {{ props.datosCheque.montoTotal }}
    </span>
  </p>
  <p class="col-12 md:col-6">
    Fecha de emisión:
    <span class="font-bold">
      {{ props.fechaDeEmision }}
    </span>
  </p>
  <p class="col-12 md:col-6">
    Monto total en palabras:
    <span class="font-bold">
      {{ props.datosCheque.montoTotalEnPalabras }}
    </span>
  </p>
  <p class="col-12 md:col-6">
    nombre de destinatario:
    <span class="font-bold">
      {{ props.datosCheque.nombreDestinatario }}
    </span>
  </p>
  <p class="col-12 md:col-6">
    Cuenta de fiscalía de origen:
    <span class="font-bold">
      {{ props.datosCheque.cuentaFiscaliaOrigen }}
    </span>
  </p>
</div>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
const props = defineProps({
  numeroDeSerie: propTypes.string,
  fechaDeEmision: propTypes.string,
  datosCheque: propTypes.object
})
</script>
