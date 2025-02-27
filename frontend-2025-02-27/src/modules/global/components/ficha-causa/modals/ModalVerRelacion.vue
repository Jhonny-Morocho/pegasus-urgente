<template>
<p class="mb-3">
  <span style="font-weight: bold">Víctima:</span>
  {{ data.relacion?.victima }}
</p>
<p class="mb-3">
  <span style="font-weight: bold">Imputado:</span>
  {{ data.relacion?.imputado }}
</p>
<p class="mb-3">
  <span style="font-weight: bold">Delito:</span>
  {{ data.relacion?.delito }}
</p>
<p class="mb-3">
  <span style="font-weight: bold">Estado de la Relacion:</span>
  {{ data.relacion?.estadoRelacion }}
</p>
<p class="mb-3">
  <span style="font-weight: bold">Etapa de la Relacion:</span>
  {{ data.relacion?.etapaRelacion }}
</p>
</template>
<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'
const data = defineProps({
  relacion: propTypes.object
})
</script>
