<template>
<AppFieldset
  class="p-fluid"
  legend="Antecedentes del Catálogo"
>
  <div class="col-12 grid p-fluid">
    <p class="col-4">
      <strong>Tipo de Catálogo: </strong>
      {{ data?.nombre_tipo_catalogo || getTipoCatalogoById(data?.idTipoCatalogo) || 'N/A' }}
    </p>
    <p class="col-4">
      <strong>RUC/Denuncia/Folio/Archivador: </strong>
      {{ data?.ruc || data?.idDenuncia || data?.idFolio || 'N/A' }}
    </p>
    <p class="col-4">
      <strong>Nombre Catálogo: </strong>
      {{ data?.nombre_catalogo || data?.nombreCatalogo || 'N/A' }}
    </p>
  </div>
</AppFieldset>
</template>
<script setup>
import { useMantenedorCDD } from '@/modules/catalogo-documental-digital/composables'
import { propTypes } from '@/modules/common/types'
import { requestUtil } from '@/utils'
import { defineProps, onMounted } from 'vue'
defineProps({
  data: propTypes.object
})
const { tipoCatalogo, mantenedorCDD_getTipoCatalogo } = useMantenedorCDD()
console.log(tipoCatalogo)
function getTipoCatalogoById (id) {
  return tipoCatalogo.value?.find((x) => x.id === id)?.nombre
}

onMounted(() => {
  requestUtil({ action: mantenedorCDD_getTipoCatalogo })
})
</script>
