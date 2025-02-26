<template>
<section class="mt-4">
  <AppFieldset legend="Listados Especies a Destrucción">
    <TablaGenerarCuponDeDeposito 
      class="w-full mb-4"
      esModelo2
      :readOnly="false"
      :value="data"
    />
  </AppFieldset>
  <Button
    class="p-button-outlined mt-6 px-6 py-2"
    icon="pi pi-print"
    icon-pos="right"
    label="Imprimir"
    @click="handlePrint"
  />
</section>
</template>
<script setup>
import { defineProps } from 'vue';
import { propTypes } from '@/modules/common/types';
import TablaGenerarCuponDeDeposito from '../../TablaGenerarCuponDeDeposito.vue';

defineProps({
  data: propTypes.object
})

function handlePrint(){
  // print...
}
</script>