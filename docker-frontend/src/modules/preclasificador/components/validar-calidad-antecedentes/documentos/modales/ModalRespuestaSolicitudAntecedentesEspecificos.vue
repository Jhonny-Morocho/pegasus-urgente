<template>
<hr>
<section class="grid">
  <div class="col-6">
    <ul>
      <li>
        <strong>Antecedentes Solicitados:</strong> {{ respuesta?.antecedenteSolicitado }}
      </li>
      <li>
        <strong>Origen:</strong> {{ respuesta?.origen }}
      </li>
      <li>
        <strong>Ámbito:</strong> {{ respuesta?.ambito }}
      </li>
      <li>
        <strong>Fecha Recepción:</strong> {{ formatDate(respuesta?.fechaRecepcion) }}
      </li>
    </ul>
  </div>
  <div class="col-6">
    <ul>
      <li>
        <strong>Tipo:</strong> {{ respuesta?.tipo }}
      </li>
      <li>
        <strong>Referencia:</strong> {{ respuesta?.referencia }}
      </li>
      <li>
        <strong>Fecha Solicitud:</strong> {{ formatDate(respuesta?.fechaSolicitud) }}
      </li>
    </ul>
  </div>
  <div class="col-12 flex justify-content-start mt-2">
    <Button
      class="btn-form px-4 ml-3"
      icon="pi pi-download"
      icon-pos="right"
      label="Descargar Documento"
      @click="descargarDocumento"
    />
  </div>
</section>
</template>
<script setup>
import { reactive } from 'vue'
import { dateTimeUtil } from '@/utils'

const respuesta = reactive({
  antecedenteSolicitado: 'Informe de Parentesco',
  origen: 'Servicio de Registro Civil',
  ambito: 'Sujeto',
  fechaRecepcion: new Date(),
  tipo: 'Víctima',
  referencia: '12.312.312-3',
  fechaSolicitud: new Date()
})

function descargarDocumento () {
  console.log('🚀 ~ file: ModalRespuestaSolicitudAntecedentesEspecificos.vue ~ line 59 ~ descargarDocumento ~ descargarDocumento')
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontend(date)
}
</script>
<style lang="scss" scoped>
ul {
    list-style: none;
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
li {
    font-size: 1.2rem;
}
</style>
