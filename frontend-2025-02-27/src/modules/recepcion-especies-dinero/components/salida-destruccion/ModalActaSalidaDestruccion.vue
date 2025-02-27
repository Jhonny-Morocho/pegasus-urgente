<template>
<section>
  <div>
    <p class="my-4">
      <strong>Código para identificación única del comprobante: </strong>{{ data?.idComprobante }}
    </p>
    <ActaSalida :data="data" />
  </div>
  <div class="my-4">
    <h3 class="mb-4">
      Especies Involucradas
    </h3>
    <TablaGenerarCuponDeDeposito
      class="w-full"
      :es-destruccion="true"
      :es-registro-salida="true"
      :selectable="false"
    />
  </div>
  <div class="grid col-12 mt-8">
    <div class="col-6 px-6">
      <hr>
      <p>Firma del Ministro de Fe</p>
    </div>
    <div class="col-6 px-6">
      <hr>
      <p>Firma del Custodio</p>
    </div>
  </div>
  <Button
    class="p-button-outlined px-8 mt-6"
    icon="pi pi-print"
    icon-pos="right"
    label="Imprimir"
    @click="print"
  />
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import defineProps from 'vue'
import ActaSalida from '@/modules/recepcion-especies-dinero/components/salida-destruccion/ActaSalida.vue'
import TablaGenerarCuponDeDeposito from '@/modules/recepcion-especies-dinero/components/generar-cupon-deposito/TablaGenerarCuponDeDeposito.vue'

defineProps({
  data: propTypes.object
})
</script>
