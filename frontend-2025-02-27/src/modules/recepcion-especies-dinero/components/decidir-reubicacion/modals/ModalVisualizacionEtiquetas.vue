<template>
<div
  id="pdf"
  class="grid"
>
  <Especie
    :especie="especie"
    :modal="modal"
  />
  <div class="col-6 mt-3">
    <img
      alt="codigoQR"
      class="m-auto"
      :src="`${foto}`"
      style="border-style: solid; border-radius: 10px; width: 200px "
    >
  </div>
</div>
<div class="col-12 flex justify-content-start px-2">
  <Button
    class="p-button btn-primary"
    icon="pi pi-print"
    icon-pos="right"
    :label="flujo === 'busqueda' ? 'Imprimir Etiqueta' : 'Imprimir Etiquetas'"
    type="button"
    @click="imprimirEtiqueta(getEtiquetaReubicacion)"
  />
</div>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import Especie from '@/modules/recepcion-especies-dinero/components/decidir-reubicacion/Especie.vue'
import { useBandejaCustodioStore, useStepBusquedaAgregarSepararEspecies } from '@/modules/recepcion-especies-dinero/composables'
import html2pdf from 'html2pdf.js'

defineProps({
  especie: propTypes.object,
  foto: propTypes.object,
  modal: {
    type: Boolean,
    default: () => true
  }
})
const { flujo } = useBandejaCustodioStore()
const { getEtiquetaReubicacion } = useStepBusquedaAgregarSepararEspecies()
function imprimirEtiqueta (etiqueta, etiquetas) {
  if (flujo.value === 'busqueda') {
    console.log('imprimirEtiqueta', etiqueta)
    const opt = {
      margin: 1,
      filename: 'documento.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { dpi: 300, letterRendering: true },
      jsPDF: { unit: 'in', format: 'a3', orientation: 'p' }
    }
    html2pdf().set(opt).from(document.querySelector('#pdf')).save('comprobante')
  } else {
    console.log('imprimirEtiquetas', etiquetas)
  }
}

</script>
