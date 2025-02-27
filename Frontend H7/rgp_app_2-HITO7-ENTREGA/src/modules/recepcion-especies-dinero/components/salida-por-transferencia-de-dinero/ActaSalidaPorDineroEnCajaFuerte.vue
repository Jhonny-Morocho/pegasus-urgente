<template>
<p class="col-12 styleNue">
  NUE: <span>{{ dataActaDeSalidaPorTransferencia.nue }}</span>
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">RUC: </span>{{ dataActaDeSalidaPorTransferencia.ruc }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Fiscalía de Origen: </span>{{ dataActaDeSalidaPorTransferencia.fiscaliaDeOrigen }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Fecha/Hora de salida: </span>{{ dataActaDeSalidaPorTransferencia.fech }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Fiscal de Origen: </span>{{ dataActaDeSalidaPorTransferencia.fiscalDeOrigen }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Tipo de Moneda: </span>{{ dataActaDeSalidaPorTransferencia.tipoDeMoneda }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Fiscalía de Destino: </span>{{ dataActaDeSalidaPorTransferencia.fiscaliaDeDestino }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Monto: </span>{{ dataActaDeSalidaPorTransferencia.monto }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Fiscal de Destino: </span>{{ dataActaDeSalidaPorTransferencia.fiscalDeDestino }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Nombre Causa: </span>{{ dataActaDeSalidaPorTransferencia.ruc }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Custodio de Destino: </span>{{ dataActaDeSalidaPorTransferencia.custodioDeDestino }}
</p>
<p class="col-12 md:col-6" />
<p class="col-12 md:col-6">
  <span class="font-bold">RUN Custodio de Destino: </span>{{ dataActaDeSalidaPorTransferencia.runCustodioDeDestino }}
</p>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'

defineProps({
  dataActaDeSalidaPorTransferencia: propTypes.object
})
</script>
