<template>
<p class="col-12">
  <span class="font-bold">
    Motivo Fijación Fotográfia:
  </span>
  {{ data?.motivo ?? 'Sin motivo' }}
</p>
<p class="col-12">
  <span class="font-bold">
    Fecha:
  </span>
  {{ data?.fecha ? dateTimeUtil.formatToFrontendWithTime(data?.fecha) : 'Sin fecha' }}
</p>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'

defineProps({
  data: propTypes.object
})
</script>
