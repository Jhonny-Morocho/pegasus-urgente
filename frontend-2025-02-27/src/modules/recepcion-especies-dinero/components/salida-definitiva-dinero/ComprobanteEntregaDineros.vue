<template>
<div class="col-12 md:col-6">
  <p class="mb-3">
    <span class="font-bold">Fecha/Hora Entrega Dinero: </span>{{ dateTimeUtil.formatToFrontendWithTime(datedata?.monto) }}
  </p>
  <p class="mb-3">
    <span class="font-bold">NUE: </span>{{ data?.interes }}
  </p>
  <p class="mb-3">
    <span class="font-bold">RUC: </span>{{ data?.montoTotal }}
  </p>
  <p class="mb-3">
    <span class="font-bold">RUE: </span>{{ data?.montoTotal }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Fiscalía: </span>{{ data?.modoEntrega }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Fiscal: </span>{{ data?.entidadBancaria }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Custodio que lo entrega: </span>{{ data?.entidadBancaria }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Modo de entrega: </span>{{ data?.entidadBancaria }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Tipo de Moneda: </span>{{ data?.entidadBancaria }}
  </p>
  <p><span class="font-bold">Monto: </span>{{ data?.numeroCuenta }}</p>
</div>
<div class="col-12 md:col-6">
  <p class="mb-3">
    <span class="font-bold">Interés: </span>{{ data?.telefono }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Monto total: </span>{{ data?.telefono }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Dueño de cuenta: </span>{{ data?.telefono }}
  </p>
  <p class="mb-3">
    <span class="font-bold">RUN Dueño: </span>{{ data?.telefono }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Entidad bancaria: </span>{{ data?.telefono }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Número de cuenta: </span>{{ data?.telefono }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Tipo de cuenta: </span>{{ data?.telefono }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Teléfono: </span>{{ data?.telefono }}
  </p>
  <p><span class="font-bold">Correo: </span>{{ data?.correo }}</p>
</div>
<AppTextarea
  id="observaciones"
  v-model="observaciones"
  class="col-12"
  cols="150"
  label="Observaciones"
  rows="5"
/>
</template>
<script setup>
import { dateTimeUtil } from '@/utils'
</script>
