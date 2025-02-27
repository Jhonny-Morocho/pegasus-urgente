
<template>
<section class="grid mt-6">
  <AntecedentesSolicitud
    hide-instrucciones-fiscal
    ver-solicitud
  />
  <FieldSetSolicitudOtraFiscalia />
</section>
</template>

<script setup>
import AntecedentesSolicitud from '@/modules/gestion-solicitudes/components/AntecedentesSolicitud.vue'
import FieldSetSolicitudOtraFiscalia from '@/modules/gestion-solicitudes/components/FieldSetSolicitudOtraFiscalia.vue'
</script>
