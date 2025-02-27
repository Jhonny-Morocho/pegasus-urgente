<template>
<AppFieldset
  class="col-12"
  legend="Acta Salida por Transferencia"
>
  <ActaDeSalidaPorTransferencia />
  <p class="text-xl mt-4 m-2">
    Detalle del Dinero
  </p>
  <TablaDesgloseDinero
    :data="dinero"
  />
</AppFieldset>
<AppBtnNextTeleported
  class="mr-2"
  icon="pi pi-angle-double-right"
  icon-pos="right"
  label="Registrar Salida"
  @click="registrarSalida"
/>
</template>
<script setup>
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import ActaDeSalidaPorTransferencia from '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/ActaDeSalidaPorTransferencia.vue'
import TablaDesgloseDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/TablaDesgloseDinero.vue'

const dinero = {
  nue: 1234,
  rue: 1234,
  custodio: 1234,
  descripcion: 1234,
  tipoMoneda: 1234,
  monto: 1234,
  tipoDelito: 1234,
  desglose: [
    {
      denominacion: 2,
      tipo: 2,
      cantidadDinero: 4
    },
    {
      denominacion: 6,
      tipo: 1,
      cantidadDinero: 2
    }
  ]
}
</script>
