<template>
<section>
  <AppFieldset legend="Identificación Interviniente">
    <div class="grid col-12">
      <div class="col-6">
        <p><strong>Tipo: </strong>{{ sujeto?.tipo }}</p>
        <p><strong>N° Documento: </strong>{{ sujeto?.numeroDocumento }}</p>
        <p><strong>Nombre Completo: </strong>{{ sujeto?.nombreCompleto }}</p>
        <p><strong>Edad: </strong>{{ sujeto?.edad }}</p>
      </div>
      <div class="col-6">
        <p><strong>Dirección: </strong>{{ sujeto?.direccion }}</p>
        <p><strong>Comuna: </strong>{{ sujeto?.comuna }}</p>
        <p><strong>Teléfono de Contacto: </strong>{{ sujeto?.telefono }}</p>
      </div>
    </div>
  </AppFieldset>
  <AppFieldset legend="Detalle Anotaciones">
    <TablaDetalleAnotaciones
      :value="anotaciones"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import TablaDetalleAnotaciones from '@/modules/tramitar-audiencia/components/tables/TablaDetalleAnotaciones.vue'
import defineProps from 'vue'

defineProps({
  anotaciones: propTypes.object,
  sujeto: propTypes.object
})
</script>
<style scoped>
p{
  margin-bottom: 20px;
}
</style>
