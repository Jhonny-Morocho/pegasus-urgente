<template>
<section>
  <hr>
  <div class="flex">
    <div class="col-6">
      <p><strong> Fecha de Creación: </strong>{{ fechaRegistro }}</p>
      <p><strong> Tipo Catálogo: </strong>{{ data?.nombre_tipo_catalogo }}</p>
      <p><strong>Nombre Catálogo: </strong>{{ data?.nombre_catalogo }}</p>
    </div>
    <div class="col-6">
      <p><strong>Nivel de Acceso: </strong>{{ NivelAcceso?.nombre }}</p>
      <p><strong>Disponibilidad: </strong>{{ data?.descripcion_disponibilidad }}</p>
      <p><strong>Solicitante: </strong>{{ data?.nombre_solicitante }}</p>
    </div>
  </div>
  <div class="col-12 mb-4">
    <p><strong>Observaciones:</strong></p>
    <p>{{ data?.descripcion }}</p>
  </div>
</section>
</template>

<script setup>
import { defineProps, onMounted } from 'vue'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useMantenedorCDD } from '@/modules/catalogo-documental-digital/composables'

const props = defineProps({
  data: propTypes.object
})

const { nivelAcceso, mantenedorCDD_getNivelAcceso } = useMantenedorCDD()
const fechaRegistro = dateTimeUtil.formatToBackend(props.data.fecha_registro)
const NivelAcceso = nivelAcceso.value.find((x) => x.id === props.data.id_nivel_acceso)
onMounted(() => {
  requestUtil({ action: mantenedorCDD_getNivelAcceso })
  console.log(nivelAcceso)
  console.log(props.data)
})
</script>

<style scoped>
p {
  margin-bottom: 15px;
  margin-top: 20px;
}
</style>
