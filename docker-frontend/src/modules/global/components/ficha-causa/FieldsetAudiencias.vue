<template>
<AppFieldset
  class="col-12"
  legend="Audiencias"
>
  *Tabla Audiencias*
</AppFieldset>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'

defineProps({
  data: propTypes.array
})
</script>
