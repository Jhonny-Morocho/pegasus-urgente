<template>
<AppFieldset
  class="p-fluid"
  legend="Antecedentes del documento físico"
>
  <div class="col-12 grid">
    <p class="col-4 my-2">
      <strong>Procedencia: </strong>{{ data?.procedencia || 'N/A' }}
    </p>
    <p class="col-4 my-2">
      <strong>Propietario: </strong>{{ data?.propietario|| 'N/A' }}
    </p>
    <p class="col-4 my-2">
      <strong>Código de barra: </strong>{{ data?.codigo|| 'N/A' }}
    </p>
    <p class="col-4 my-2">
      <strong>Nombre Documento: </strong>{{ data?.nombre|| 'N/A' }}
    </p>
    <p class="col-4 my-2">
      <strong>Teléfono: </strong>{{ data?.telefono|| 'N/A' }}
    </p>
    <p class="col-4 my-2">
      <strong>Pazo de entrega: </strong>{{ data?.plazoEntrega|| 'N/A' }}
    </p>
    <p class="col-4 my-2">
      <strong>Clase Documental: </strong>{{ data?.claseDocumental|| 'N/A' }}
    </p>
    <p class="col-4 my-2">
      <strong>Ubicación Física: </strong>{{ data?.ubicacion|| 'N/A' }}
    </p>
  </div>
</AppFieldset>
</template>

<script setup>
// COMPONENTS

// UTILS
import defineProps from 'vue'

// COMPONSABLES
import { propTypes } from '@/modules/common/types'

// VALUES
defineProps({
  data: propTypes.object
})

// LOGIC

</script>

<style scoped>
p {
  margin-top: 15px;
  margin-bottom: 20px;
}
</style>
