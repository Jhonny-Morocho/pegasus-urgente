<template>
<div class="grid py-3 col-12 mb-2 ml-6">
  <div class="col-3">
    <p class="mb-4">
      <strong>Nombre documento: </strong>
      {{ data?.nombre || 'N/A' }}
    </p>
    <p class="mb-4">
      <strong>Clase Documental: </strong>
      {{ data?.claseDocumental || 'N/A' }}
    </p>
    <p class="mb-4">
      <strong>RUC/Denuncia/Folio/Archivador: </strong>
      {{ identificadorOrigenDocumento }}
    </p>
  </div>
  <div class="col-3">
    <div class="mb-5 mt-3">
      <img
        alt="documento"
        src="@/assets/images/icono-devolucion.png"
      >
    </div>
  </div>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps, computed } from 'vue'

const props = defineProps({
  data: propTypes.object
})
const identificadorOrigenDocumento = computed(() => {
  return props.data?.ruc || props.data?.idDenuncia || props.data?.idFolio || props.data?.nombreCatalogo || 'N/A'
})
</script>
