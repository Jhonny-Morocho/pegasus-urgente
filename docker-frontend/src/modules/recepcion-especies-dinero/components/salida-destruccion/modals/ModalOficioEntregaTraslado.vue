<template>
<hr/>
<section class="px-4">
  <MailHeader
    :data="data?.destinatario"
  />

  <div class="my-4">
    <h4 class="mb-4">Especies Involucradas:</h4>
    <TablaEspeciesDinero
      esModelo2
      readOnly
      :value="especies"
    />
  </div>

  <div class="mt-4">
    <p>Sin otro particular, saluda atentamente a Ud.,</p>
    <p>{{ data?.usuario?.nombre || 'CRISTIAN ANDRADE'}}</p>
    <p>
      {{ data?.usuario?.cargo || 'Fiscal Adjunto Jefe '}} - 
      {{ data?.usuario?.fiscalia || 'Fiscalía Antinarcóticos y Crimen Organizado'}}
    </p>
    <p>{{ data?.usuario?.fiscalia || 'Fiscalía Regional de Valparaíso'}}</p>
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
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types';
import { defineProps } from 'vue';
import TablaEspeciesDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/TablaEspeciesDinero.vue';
import MailHeader from '@/modules/recepcion-especies-dinero/components/salida-destruccion/MailHeader.vue'

defineProps({
  data: propTypes.object
})
</script>

<style scoped>
p{
  padding: 5px 0 5px 0;
}
</style>