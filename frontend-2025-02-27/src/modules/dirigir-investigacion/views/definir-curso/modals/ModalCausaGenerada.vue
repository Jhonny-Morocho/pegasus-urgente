<template>
<section>
  <div>
    <hr class="mb-5">
    <h3 class="mb-4">
      RUC: {{ informacion?.ruc }}
    </h3>
    <h3 class="mb-4">
      Fecha / Hora Creación: <span>{{ informacion?.fechaHoraCreacion }}</span>
    </h3>
    <h3 class="mb-4">
      Especie y Dinero: <span>{{ informacion?.cantidadEspecieDinero }} ítem(s)</span>
    </h3>
    <h3 class="mb-4">
      Diligencias Asociadas: <span>{{ informacion?.cantidadDiligencias }} diligencia(s)</span>
    </h3>
    <h3 class="mb-4">
      Relación(es): <span>{{ informacion?.cantidadRelaciones }} relacion(es)</span>
    </h3>
  </div>
</section>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  informacion: {
    type: Object,
    default: () => null
  }
})
</script>

<style scoped>
  span {
    font-weight: 400;
  }
</style>
