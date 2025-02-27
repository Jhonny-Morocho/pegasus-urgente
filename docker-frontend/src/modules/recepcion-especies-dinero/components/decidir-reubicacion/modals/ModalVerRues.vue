<template>
<p
  v-for="r in rues"
  :key="r"
  style="font-size:1.2em"
>
  <span class="font-bold">RUE:</span>
  {{ r }}
</p>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  data: propTypes.object,
  rues: propTypes.array
})
</script>
