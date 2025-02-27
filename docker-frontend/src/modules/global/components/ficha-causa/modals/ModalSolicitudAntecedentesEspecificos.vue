<template>
<section>
  <TablaSolicitudAntecedentesEspecificos
    class="mb-8"
    :ruc="ruc"
  />
  <TablaAntecedentesSolicitados :ruc="ruc" />
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'
import TablaSolicitudAntecedentesEspecificos from './TablasSolicitudAntecedentesEspecificos/TablaSolicitudAntecedentesEspecificos.vue'
import TablaAntecedentesSolicitados from './TablasSolicitudAntecedentesEspecificos/TablaAntecedentesSolicitados.vue'

defineProps({
  ruc: propTypes.string
})
</script>
