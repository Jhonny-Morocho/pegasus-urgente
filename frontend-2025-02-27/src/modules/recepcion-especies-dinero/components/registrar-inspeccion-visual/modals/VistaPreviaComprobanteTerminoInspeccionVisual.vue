<template>
<div
  id="pdf"
  class="grid p-2"
>
  <h2 class="mt-4">
    {{ title }}
  </h2>
  <Divider />
  <Causa :data-causa="dataComprobanteTermino" />
  <p class="title col-12">
    Registros de Inspección:
  </p>
  <RegistrosInspeccion :registros-inspeccion="dataRegistrosInspeccion" />
  <p class="title col-12">
    Especies:
  </p>
  <EspeciesDinero :especies-dineros="dataEspeciesDinero" />
  <p class="title col-12">
    Asistentes:
  </p>
  <PersonasAsistenInspeccionVisual :personas-asisten="dataPersonasAsisten" />
  <div class="  col-12 mt-8 mb-8 mx-3 flex justify-content-around">
    <div class="col-3 text-center">
      <hr>
      <h3>Firma del Receptor</h3>
    </div>
    <div class="col-3 text-center">
      <hr>
      <h3>Firma del Custodio</h3>
    </div>
  </div>
</div>

<Button
  class="px-4 p-button-outlined"
  :icon="'pi pi-sign-out'"
  icon-pos="right"
  :label="'Imprimir'"
  @click="descargarPdf"
/>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import Causa from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/Causa.vue'
import RegistrosInspeccion from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/RegistrosInspeccion.vue'
import EspeciesDinero from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/EspeciesDinero.vue'
import PersonasAsistenInspeccionVisual from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/PersonasAsistenInspeccionVisual.vue'
import html2pdf from 'html2pdf.js'

defineProps({
  title: propTypes.string,
  dataComprobanteTermino: propTypes.object,
  dataRegistrosInspeccion: propTypes.array,
  dataEspeciesDinero: propTypes.object,
  dataPersonasAsisten: propTypes.object
})

function descargarPdf () {
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
<style lang="scss" scoped>
.title {
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 1.5em;
}
</style>
