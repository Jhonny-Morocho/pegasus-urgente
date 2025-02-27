<template>
<AppFieldset
  class="py-4 mt-4 mx-0"
  legend="Criterios de Búsqueda"
>
  <div class="col-12 md:col-4 pb-4 md:pb-0">
    <h3 class="mb-3">
      Denunciante(s):
    </h3>
    <p
      v-for="(denunciante, i) in criteriosBusqueda?.nombreCompletoDenunciante"
      :key="i"
    >
      {{ denunciante }}
    </p>
  </div>
  <div class="col-12 md:col-4 pb-4 md:pb-0">
    <h3 class="mb-3">
      Víctima(s):
    </h3>
    <p
      v-for="(victima, i) in criteriosBusqueda?.nombreCompletoVictima"
      :key="i"
    >
      {{ victima }}
    </p>
  </div>
  <div class="col-12 md:col-4 pb-4 md:pb-0">
    <h3 class="mb-3">
      Imputado(s):
    </h3>
    <p
      v-for="(imputado, i) in criteriosBusqueda?.nombreCompletoImputado"
      :key="i"
    >
      {{ imputado }}
    </p>
  </div>
  <div class="col-12 hidden md:block">
    <hr class="my-4">
  </div>
  <div class="col-12 md:col-4 pb-4 md:pb-0">
    <h3 class="mb-3">
      Fecha Delito:
    </h3>
    <p>
      {{ criteriosBusqueda?.fechaOcurrencia }}
    </p>
  </div>
  <div class="col-12 md:col-4 pb-4 md:pb-0">
    <h3 class="mb-3">
      Delito(s):
    </h3>
    <p
      v-for="(delito, i) in criteriosBusqueda?.nombreDelito"
      :key="i"
    >
      {{ mantenedor_getNombreTipoDelito(delito) }}
    </p>
  </div>
  <div class="col-12 md:col-4">
    <h3 class="mb-3">
      Lugar Delito:
    </h3>
    <p
      v-for="(lugarDelito, i) in criteriosBusqueda?.lugarDelito"
      :key="i"
    >
      <span v-if="lugarDelito">{{ lugarDelito }}</span>
      <span v-else>Sin Dirección</span>
    </p>
  </div>
</AppFieldset>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types/prop.types'
import { useMantenedorStore } from '@/modules/global/composables'

const { mantenedor_getNombreTipoDelito } = useMantenedorStore()
defineProps({
  criteriosBusqueda: propTypes.object
})

</script>
