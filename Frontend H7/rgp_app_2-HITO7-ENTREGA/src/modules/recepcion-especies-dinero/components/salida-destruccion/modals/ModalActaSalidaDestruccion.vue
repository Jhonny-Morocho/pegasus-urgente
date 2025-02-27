<template>
<section class="col-12 mt-4">
  <div>
    <h4 class="mb-4">Código para identificación única del comprobante:</h4>
    <ShowTwoColumnData
      :data-col1="data.dataCol1"
      :data-col2="data.dataCol2"
    />
  </div>
  <div class="my-6">
    <h4 class="mb-4">Especies Involucradas</h4>
    <TablaGenerarCuponDeDeposito 
      class="w-full mb-4"
      :selectable="false"
      es-destruccion
      es-registro-salida
    />
  </div>
  <div class="grid col-12 mt-8">
    <div class="col-6 px-6">
      <hr/>
      <p>Firma Minstro de Fe</p>
    </div>
    <div class="col-6 px-6">
      <hr/>
      <p>Firma del Custodio</p>
    </div>
  </div>
  <Button
    class="p-button-outlined mt-6 ml-4 px-6"
    icon="pi pi-print"
    icon-pos="right"
    label="Imprimir"
    @click="print"
  />
</section>
</template>

<script setup>
import defineProps from 'vue';
import { propTypes } from '@/modules/common/types';
import ShowTwoColumnData from '@/modules/recepcion-especies-dinero/components/global/ShowTwoColumnData.vue';
import TablaGenerarCuponDeDeposito from '../../generar-cupon-deposito/TablaGenerarCuponDeDeposito.vue';

defineProps({
  data: propTypes.object
})
</script>