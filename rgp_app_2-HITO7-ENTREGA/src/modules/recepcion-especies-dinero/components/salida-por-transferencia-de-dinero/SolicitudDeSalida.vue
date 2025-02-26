<template>
<div class="grid">
  <p class="col-12 md:col-6">
    <span class="font-bold">Fecha de solicitud: </span>{{ dataSolicitudDeSalida.fechaSolicitud }}
  </p>
  <p
    v-if="tipoSalida !== 'cajaFuerte'"
    class="col-12 md:col-6"
  >
    <span class="font-bold">Destinatario: </span>{{ dataSolicitudDeSalida.destinatario }}
  </p>
  <p
    v-if="tipoSalida !== 'cajaFuerte'"
    class="col-12 md:col-6"
  >
    <span class="font-bold">Fecha de salida: </span>{{ dataSolicitudDeSalida.fechaDeSalida }}
  </p>
  <p
    v-if="tipoSalida !== 'cajaFuerte'"
    class="col-12 md:col-6"
  >
    <span class="font-bold">RUN Destinatario: </span>{{ dataSolicitudDeSalida.runDestinatario }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fiscalía de Origen: </span>{{ dataSolicitudDeSalida.fiscaliaDeOrigen }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fiscalía de Destino: </span>{{ dataSolicitudDeSalida.fiscaliaDeDestino }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fiscal de Origen: </span>{{ dataSolicitudDeSalida.fiscalDeOrigen }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fiscal de Destino: </span>{{ dataSolicitudDeSalida.fiscalDeDestino }}
  </p>
  <p
    v-if="tipoSalida !== 'cajaFuerte'"
    class="col-12 md:col-6"
  >
    <span class="font-bold">Número de convenio de origen: </span>{{ dataSolicitudDeSalida.numeroDeConvenioDeDestino }}
  </p>
  <p
    v-if="tipoSalida !== 'cajaFuerte'"
    class="col-12 md:col-6"
  >
    <span class="font-bold">Número de convenio de Destino: </span>{{ dataSolicitudDeSalida.numeroDeConvenioDeDestino }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Codigo de fiscalía de origen: </span>{{ dataSolicitudDeSalida.codigoDeFiscaliaDeOrigen }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Código de fiscalía de Destino: </span>{{ dataSolicitudDeSalida.codigoDeFiscaliaDeDestino }}
  </p>
  <p
    v-if="tipoSalida !== 'cajaFuerte'"
    class="col-12 md:col-6"
  >
    <span class="font-bold">Cuenta de fiscalía de origen: </span>{{ dataSolicitudDeSalida.cuentaDeFiscaliaDeOrigen }}
  </p>
  <p
    v-if="tipoSalida !== 'cajaFuerte'"
    class="col-12 md:col-6"
  >
    <span class="font-bold">Cuenta de fiscalía de Destino: </span>{{ dataSolicitudDeSalida.cuentaDeFiscaliaDeDestino }}
  </p>
</div>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'

defineProps({
  dataSolicitudDeSalida: propTypes.object,
  tipoSalida: propTypes.string
})
</script>
