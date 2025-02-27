<template>
<div
  id="pdf"
  class="my-3"
>
  <h2 class="mt-2">
    {{ title }}
  </h2>
  <hr>
  <div
    class="col-12 md:col-6 mt-3"
  >
    <p v-if="esTransferencia">
      <span style="font-size: 1.5em">NUE:</span>{{ dataActaSalidaTransferencia?.salidaTransferencia?.nue }}
    </p>
    <p v-else>
      <span style="font-size: 1.5em">NUE:</span>{{ dataActaSalidaTemporal?.salida?.nue }}
    </p>
  </div>

  <ActaDeSalida
    :data-acta="esTransferencia? dataActaSalidaTransferencia.salidaTransferencia : dataActaSalidaTemporal.salida"
    :modal="true"
  />
  <EspeciesInvolucradas
    :especies-dineros="esTransferencia?dataActaSalidaTransferencia.especiesInvolucradas : dataActaSalidaTemporal.especiesInvolucradas"
    :modal="true"
  />
  <div>
    <p>Codigo QR:</p>
    <div class="col-12 md:col-6 text-center">
      <LoaderSkeleton v-if="isLoading" />
      <img
        v-else
        alt="imagen QR"
        class="w-8 md:w-6 lg:w-6 m-auto"
        :src="`${fotoQr}`"
        style="border-style: solid; border-radius: 8px"
      >
    </div>
  </div>
  <div class="col-12 mt-8 mb-8 mx-3 flex justify-content-around">
    <div class="col-3 text-center">
      <hr>
      <p>Firma de {{}}</p>
    </div>
    <div class="col-3 text-center">
      <hr>
      <p>Firma de {{}}</p>
    </div>
  </div>
</div>
<Button
  class="boton p-button-raised p-button-plain px-4 ml-2"
  icon="pi pi-print"
  icon-pos="right"
  label="Imprimir"
  @click="imprimirComprobante"
/>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import html2pdf from 'html2pdf.js'

import ActaDeSalida from '@/modules/recepcion-especies-dinero/components/registro-salida-temporal/ActaDeSalida.vue'
import EspeciesInvolucradas from '@/modules/recepcion-especies-dinero/components/registro-salida-temporal/EspeciesInvolucradas.vue'

defineProps({
  title: propTypes.string,
  dataActa: propTypes.object,
  especiesDinero: propTypes.object,
  fotoQr: propTypes.string,
  dataActaSalidaTemporal: propTypes.object,
  esTransferencia: Boolean,
  dataActaSalidaTransferencia: propTypes.object
})
function imprimirComprobante () {
  const opt = {
    margin: 1,
    filename: 'documento.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { dpi: 300, letterRendering: true },
    jsPDF: { unit: 'in', format: 'a3', orientation: 'p' }
  }
  html2pdf().set(opt).from(document.querySelector('#pdf')).save('comprobante')
}

</script>
