<template>
<div>
  <div
    id="pdf"
    class="grid"
  >
    <div class="col-6 grid">
      <div class="col-6">
        NUE:
      </div>
      <div class="col-6">
        <strong>{{ props.data.nue }}</strong>
      </div>
      <div class="col-6">
        RUC:
      </div>
      <div class="col-6">
        <strong>{{ props.data.ruc }}</strong>
      </div>
      <div class="col-6">
        RUE:
      </div>
      <div class="col-6">
        <strong>{{ props.data.RUE }}</strong>
      </div>
      <div class="col-6">
        Familia Especie:
      </div>
      <div class="col-6">
        <strong>{{ mantenedor_getNombreFamiliaEspecie(props.data.idFamilia) }}</strong>
      </div>
      <div class="col-6">
        Tipo Especie:
      </div>
      <div class="col-6">
        <strong>{{ tipoEspecie(props.data.idTipoEspecie) }}</strong>
      </div>
      <div class="col-6">
        Bodega:
      </div>
      <div class="col-6">
        <strong>{{ props.data.nombreBodega }}</strong>
      </div>
      <div class="col-6">
        Casillero:
      </div>
      <div class="col-6">
        <strong>{{ props.data.nombreCasillero }}</strong>
      </div>
      <div class="col-6">
        Sector:
      </div>
      <div class="col-6">
        <strong>{{ props.data.nombreSector }}</strong>
      </div>
      <div class="col-6">
        Fecha Ingreso:
      </div>
      <div class="col-6">
        <strong>{{ formatDate(props.data.fechaIngreso) }}</strong>
      </div>
      <div class="col-6">
        Procedencia:
      </div>
      <div class="col-6">
        <strong>hola2343</strong>
      </div>
      <div class="col-6">
        Observación:
      </div>
      <div class="col-6">
        <strong v-if="props.data.observaciones === null">Sin observaciones</strong>
        <strong v-else>{{ props.data.observaciones }}</strong>
      </div>
      <div class="col-6">
        Razón:
      </div>
      <div class="col-6">
        <strong>hola2343</strong>
      </div>
    </div>
    <div class="col-6 text-center">
      <h3 class="mb-2">
        Código QR
      </h3>
      <img
        alt="codigoQR"
        class="m-auto"
        :src="`${props.data.foto}`"
        style="border-style: solid; border-radius: 10px"
      >
    </div>
  </div>
  <div class="flex justify-content-center mt-3">
    <Button
      class="btn-fileupload px-3"
      icon="pi pi-print"
      icon-pos="right"
      label="Imprimir"
      style="width: auto"
      @click="imprimirEtiqueta"
    />
  </div>
</div>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil, dateTimeUtil } from '@/utils'
import html2pdf from 'html2pdf.js'

const props = defineProps({
  data: propTypes.object,
  masData: propTypes.object
})

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie
} = useMantenedorStore()

function tipoEspecie (idTipoEspecie) {
  requestUtil({
    action: mantenedor_getAllTiposEspecie
  })
  return mantenedor_getNombreTipoEspecie(idTipoEspecie)
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
function imprimirEtiqueta () {
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
