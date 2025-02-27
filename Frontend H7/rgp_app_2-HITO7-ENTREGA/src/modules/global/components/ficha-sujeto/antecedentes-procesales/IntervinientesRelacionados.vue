<template>
<TablaSujetos
  :es-ficha-causa="true"
  :list-value="sujetoIntervinientes"
  :loading="loadingTablaSujetos"
  @set-sujeto-editar="setModoEdicion"
/>
</template>

<script setup>

import TablaSujetos from '@/modules/global/components/sujetos-intervinientes/tablas/TablaSujetos.vue'
import { useSujetosIntervinientesStore } from '@/modules/global/composables'
const { sujetoIntervinientes } = useSujetosIntervinientesStore()
</script>
