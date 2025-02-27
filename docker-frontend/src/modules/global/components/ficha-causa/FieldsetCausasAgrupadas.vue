<template>
<AppFieldset
  class="col-12"
  legend="Causas Agrupadas"
>
  *Tabla Causas Agrupadas*
</AppFieldset>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'

defineProps({
  data: propTypes.array
})
</script>
