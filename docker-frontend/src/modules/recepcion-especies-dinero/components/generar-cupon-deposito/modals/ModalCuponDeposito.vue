<template>
<AppDataTable
  id="tablaListadoGenerado"
  breakpoint="960px"
  class="col-12"
  :paginator="false"
  responsive-layout="stack"
  :rows="10"
  :total-records="data.length <= 10"
  :value="[data]"
>
  <Column
    field="nue"
    filter-field="nue"
    header="NUE"
  >
    <template #body="{}">
      {{ data.nue }}
    </template>
  </Column>
  <Column
    field="rue"
    filter-field="rue"
    header="RUE"
  >
    <template #body="{}">
      {{ data?.rue }}
    </template>
  </Column>
  <Column
    field="ruc"
    filter-field="ruc"
    header="RUC"
  >
    <template #body="{}">
      {{ data?.ruc }}
    </template>
  </Column>
  <Column
    field="tipoDelito"
    filter-field="tipoDelito"
    header="Tipo Delito"
  >
    <template #body="{}">
      {{ data?.tipoDelito }}
    </template>
  </Column>
  <Column
    field="codigoFiscalia"
    filter-field="codigoFiscalia"
    header="Fiscalía Regional"
  >
    <template #body="{}">
      {{ data?.fiscaliaRegional }}
    </template>
  </Column>
  <Column
    field="codigoFiscalia"
    filter-field="codigoFiscalia"
    header="Fiscalía Local"
  >
    <template #body="{}">
      {{ data?.fiscaliaLocal }}
    </template>
  </Column>
  <Column
    field="numeroConvenio"
    filter-field="numeroConvenio"
    header="Número de Convenio"
  >
    <template #body="{}">
      {{ data?.numeroConvenio }}
    </template>
  </Column>
  <Column
    field="cuentaDeposito"
    filter-field="cuentaDeposito"
    header="Cuenta depósito"
  >
    <template #body="{}">
      {{ data?.cuentaDeposito }}
    </template>
  </Column>
  <Column
    field="monto"
    filter-field="monto"
    header="Monto"
  >
    <template #body="{}">
      $ {{ data?.montoDeposito }}
    </template>
  </Column>
</AppDataTable>

<div class="col-12 grid">
  <div class="col-6">
    <p class="my-2">
      Fecha Depósito: <span>{{ datosQuienGeneraDeposito?.fechaDeposito }}</span>
    </p>
    <p class="my-2">
      Depositado por:: <span>{{ datosQuienGeneraDeposito.nombreDepositante }}</span>
    </p>
    <p class="my-2">
      RUN:: <span>{{ datosQuienGeneraDeposito?.rutDepositante }}</span>
    </p>
    <p class="my-2">
      Teléfono:: <span>{{ datosQuienGeneraDeposito?.telefono }}</span>
    </p>
    <p class="my-2">
      Correo:: <span>{{ datosQuienGeneraDeposito?.email }}</span>
    </p>
  </div>
  <div class="col-6">
    <p class="text-bold">
      Total: <span class="text-secundary">${{ data.montoDeposito }}</span>
    </p>
    <div class="col-12 md:col-6 text-center w-full">
      <LoaderSkeleton v-if="isLoading" />
      <img
        v-else
        alt="imagen QR"
        class="w-8 md:w-6 lg:w-12 m-auto w-full"
        :src="`${dataCodigoBarra}`"
        style="border-style: solid; border-radius: 8px;  height: 10vh"
      >
    </div>
  </div>
</div>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  data: propTypes.object,
  cuponComprobante: propTypes.boolean,
  datosQuienGeneraDeposito: propTypes.object,
  dataCodigoBarra: propTypes.object
})

</script>
