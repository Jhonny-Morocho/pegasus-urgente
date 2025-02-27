<template>
<div>
  <div
    v-if="esDatosOriginales || data?.RUC"
    class="grid formgrid pb-2"
  >
    <div class="col-5">
      <strong>N° de RUC/Folio/Denuncia:</strong>
    </div>
    <div class="col-7">
      {{ data?.RUC || 'N/A' }}
    </div>
  </div>
  <div
    v-if="esDatosOriginales || data?.nombre"
    class="grid formgrid pb-2"
  >
    <div class="col-5">
      <strong>Nombre del Archivo:</strong>
    </div>
    <div class="col-7">
      {{ data?.nombre || 'N/A' }}
    </div>
  </div>
  <div
    v-if="esDatosOriginales || data?.claseDocumental"
    class="grid formgrid pb-2"
  >
    <div class="col-5">
      <strong>Clase documental:</strong>
    </div>
    <div class="col-7">
      {{ data?.claseDocumental || 'N/A' }}
    </div>
  </div>
  <div
    v-if="esDatosOriginales || data?.formatoRecepcion"
    class="grid formgrid pb-2"
  >
    <div class="col-5">
      <strong>Formato de recepción:</strong>
    </div>
    <div class="col-7">
      {{ data?.formatoRecepcion || 'N/A' }}
    </div>
  </div>
  <div
    v-if="esDatosOriginales || data?.procedencia"
    class="grid formgrid pb-2"
  >
    <div class="col-5">
      <strong>Procedencia:</strong>
    </div>
    <div class="col-7">
      {{ data?.procedencia || 'N/A' }}
    </div>
  </div>
  <div
    v-if="esDatosOriginales || data?.idioma"
    class="grid formgrid pb-2"
  >
    <div class="col-5">
      <strong>Idioma:</strong>
    </div>
    <div class="col-7">
      {{ data?.idioma || 'N/A' }}
    </div>
  </div>
  <div
    v-if="esDatosOriginales || data?.nivelFirma"
    class="grid formgrid pb-2"
  >
    <div class="col-5">
      <strong>Firma:</strong>
    </div>
    <div class="col-7">
      {{ data?.nivelFirma || 'N/A' }}
    </div>
  </div>
  <div
    v-if="esDatosOriginales || data?.nivelAcceso"
    class="grid formgrid pb-2"
  >
    <div class="col-5">
      <strong>Nivel de Acceso:</strong>
    </div>
    <div class="col-7">
      {{ data?.nivelAcceso || 'N/A' }}
    </div>
  </div>
  <div
    v-if="esDatosOriginales || data?.cantidadPaginas"
    class="grid formgrid pb-2"
  >
    <div class="col-5">
      <strong>Cantidad de páginas:</strong>
    </div>
    <div class="col-7">
      {{ data?.cantidadPaginas || 'N/A' }}
    </div>
  </div>
  <div
    v-if="esDatosOriginales || data?.disponibleConsultas"
    class="grid formgrid pb-2"
  >
    <div class="col-5">
      <strong>Disponible para consultas:</strong>
    </div>
    <div class="col-7">
      {{ data?.disponibleConsultas || 'N/A' }}
    </div>
  </div>
  <div
    v-if="esDatosOriginales || data?.almacenamientoFisico"
    class="grid formgrid pb-2"
  >
    <div class="col-5">
      <strong>Requiere almacenamiento físico:</strong>
    </div>
    <div class="col-7">
      {{ data?.almacenamientoFisico || 'N/A' }}
    </div>
  </div>
  <div
    v-if="esDatosOriginales || data?.respaldoFisico"
    class="grid formgrid pb-2"
  >
    <div class="col-5">
      <strong>Existe respaldo físico en custodia:</strong>
    </div>
    <div class="col-7">
      {{ data?.respaldoFisico || 'N/A' }}
    </div>
  </div>
  <div
    v-if="esDatosOriginales || data?.esEvidencia"
    class="grid formgrid pb-2"
  >
    <div class="col-5">
      <strong>Es Evidencia:</strong>
    </div>
    <div class="col-7">
      {{ data?.esEvidencia || 'N/A' }}
    </div>
  </div>
  <div
    v-if="esDatosOriginales || data?.resumen"
    class="grid formgrid py-4"
  >
    <div class="col-5">
      <strong>Resumen: </strong>
    </div>
    <div class="col-7">
      {{ data?.resumen || 'N/A' }}
    </div>
  </div>
  <div
    v-if="!esDatosOriginales"
    class="grid formgrid py-4"
  >
    <div class="col-5">
      <strong>Comentarios a actualización : </strong>
    </div>
    <div class="col-7">
      {{ data?.comentariosActualizacion || 'N/A' }}
    </div>
  </div>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'
defineProps({
  data: propTypes.object,
  catalogo: propTypes.object,
  esDatosOriginales: Boolean
})
</script>
