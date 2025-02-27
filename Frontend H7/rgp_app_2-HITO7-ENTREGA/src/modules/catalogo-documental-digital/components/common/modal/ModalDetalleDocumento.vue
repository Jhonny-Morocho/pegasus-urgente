<template>
<hr>
<section class="grid">
  <div class="col-6">
    <ul class="list-none w-full mt-2 mx-0 px-0">
      <li class="col-12 md:col-12 px-2 mb-2">
        <strong>N° de RUC/Folio/Denuncia: </strong>{{ data?.ruc ?? "N/A" }}
      </li>
      <li class="col-12 md:col-12 px-2 mb-2">
        <strong>Nombre del Archivo: </strong>{{ data?.nombre ?? "N/A" }}
      </li>
      <li class="col-12 md:col-12 px-2 mb-2">
        <strong>Clase documental: </strong> {{ data?.claseDocumental ?? "N/A" }}
      </li>
      <li class="col-12 md:col-12 px-2 mb-2">
        <strong>Formato de recepción: </strong>{{ data?.formatoRecepcion ?? "N/A" }}
      </li>
      <li class="col-12 md:col-12 px-2 mb-2">
        <strong>Procedencia: </strong> {{ data?.procedencia ?? "N/A" }}
      </li>
      <li class="col-12 md:col-12 px-2 mb-2">
        <strong>Idioma: </strong> {{ data?.idioma ?? "N/A" }}
      </li>
      <li class="col-12 md:col-12 px-2 mb-2">
        <strong>Firma: </strong> {{ data?.nivelFirma ?? "N/A" }}
      </li>
    </ul>
  </div>
  <div class="col-6">
    <ul class="list-none w-full mt-2 px-0">
      <li class="col-12 md:col-12 mb-2">
        <strong>Nivel de Acceso: </strong> {{ data?.nivelAcceso ?? "N/A" }}
      </li>
      <li class="col-12 md:col-12 mb-2">
        <strong>Cantidad de Páginas: </strong>
        {{ data?.cantidadPaginas ?? "N/A" }}
      </li>
      <li class="col-12 md:col-12 mb-2">
        <strong>Disponible para consultas: </strong>
        {{ nombrePorCodigo(data?.disponibleConsultas) || data?.disponibleConsultas|| "N/A" }}
      </li>
      <li class="col-12 md:col-12 mb-2">
        <strong>Requiere almacenamiento físico: </strong>
        {{ nombrePorCodigo(data?.almacenamientoFisico) ||data?.almacenamientoFisico|| "N/A" }}
      </li>
      <li class="col-12 md:col-12 mb-2">
        <strong>Existe respaldo físico en custodia: </strong>
        {{ nombrePorCodigo(data?.respaldoFisico) ||data?.respaldoFisico|| "N/A" }}
      </li>
      <li class="col-12 md:col-12 mb-2">
        <strong>Es Evidencia: </strong>
        {{ nombrePorCodigo(data?.esEvidencia) || data?.esEvidencia|| "N/A" }}
      </li>
    </ul>
  </div>
  <div class="col-12">
    <ul class="list-none w-full mt-2 px-0">
      <li class="col-12 md:col-12 mb-2">
        <strong>Resumen: </strong> {{ data?.resumen ?? "N/A" }}
      </li>
    </ul>
  </div>
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { inject, reactive, defineProps, computed } from 'vue'

const dialogRef = inject('dialogRef')

function nombrePorCodigo (valor) {
  if (valor === 1) {
    return 'Si'
  } else if (valor === 0) {
    return 'No'
  } else if (valor === 2) {
    return 'Por definir'
  }
}

const props = defineProps({
  data: propTypes.object
})

const propsInject = reactive({
  ...dialogRef.value?.data
})

const data = computed(() => {
  if (props.data) {
    return props.data
  } else return propsInject.data
})
</script>

<style scoped>
.observaciones {
  padding: 0px 0px 0px 52px;
}
</style>
