<template>
<div class="col-12 grid">
  <p class="col-12 styleNue">
    NUE: <span>{{ dataActaDeSalida?.nue }}</span>
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">RUC: </span>{{ dataActaDeSalida?.ruc }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fiscalía de Origen: </span>{{ dataActaDeSalida?.fiscaliaDeOrigen }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fecha/Hora de salida: </span>{{ dataActaDeSalida?.fech }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fiscal de Origen: </span>{{ dataActaDeSalida?.fiscalDeOrigen }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Tipo de Moneda: </span>{{ dataActaDeSalida?.tipoDeMoneda }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fiscalía de Destino: </span>{{ dataActaDeSalida?.fiscaliaDeDestino }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Monto: </span>{{ dataActaDeSalida?.monto }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fiscal de Destino: </span>{{ dataActaDeSalida?.fiscalDeDestino }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Nombre Causa: </span>{{ dataActaDeSalida?.ruc }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Custodio de Destino: </span>{{ dataActaDeSalida?.custodioDeDestino }}
  </p>
  <p class="col-12 md:col-6" />
  <p class="col-12 md:col-6">
    <span class="font-bold">RUN Custodio de Destino: </span>{{ dataActaDeSalida?.runCustodioDeDestino }}
  </p>
  <p class="col-12 mt-4">
    <span class="font-bold">Observaciones: </span>{{ dataActaDeSalida?.observaciones }}
  </p>
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
</div>
</template>
