<template>
<section>
  <hr>
  <div class="grid px-3 pt-3 m-0">
    <div class="col-12 md:col-6">
      <ul>
        <li>
          <strong>RUC:</strong> {{ causa?.ruc }}
        </li>
        <li>
          <strong>Causa Reservada:</strong> {{ causa?.esReservada ? 'Si':'No' }}
        </li>
        <li v-show="false">
          <strong>Fiscal Asignado:</strong> {{ causa?.nombreFiscalAsignado }}
        </li>
        <li>
          <strong>Proceso de la causa:</strong> {{ causa?.descripcionProceso }}
        </li>
        <li>
          <strong>Fiscalía:</strong> {{ `${causa?.tipoFiscalia} - ${causa?.nombreFiscalia}` }}
        </li>
        <li v-show="false">
          <strong>Fecha de Formalización:</strong> {{ formatDate(causa?.fechaFormalizacion) }}
        </li>
        <li v-show="false">
          <strong>Fecha Prescripción:</strong> {{ formatDate(causa?.fechaPrescripcion) }}
        </li>
      </ul>
    </div>
    <div class="col-12 md:col-6">
      <ul>
        <li>
          <strong>Nombre Causa:</strong> {{ causa?.nombreCausa }}
        </li>
        <li>
          <strong>Fecha de Creación:</strong> {{ formatDate(causa?.fechaCreacion) }}
        </li>
        <li>
          <strong>Estado de la causa:</strong> {{ causa?.descripcionEstado }}
        </li>
        <li v-show="false">
          <strong>Estado de las relaciones de la causa:</strong> {{ causa?.descripcionEstadoRelacion }}
        </li>
        <li>
          <strong>Fecha de Asignación:</strong> {{ formatDate(causa?.fechaAsignacion) }}
        </li>
        <li v-show="false">
          <strong>Plazo de Investigación:</strong> {{ causa?.plazoInvestigacionDias }} Días
        </li>
      </ul>
    </div>
  </div>
</section>
</template>

<script setup>
import { defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'

defineProps({
  causa: propTypes.object
})

function formatDate (value) {
  return dateTimeUtil.formatToFrontend(value)
}
</script>

<style lang="scss" scoped>

hr {
  border: 1px solid #ccc;
}

ul {
  list-style: none;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
li {
  font-size: 1.2rem;
}
</style>
