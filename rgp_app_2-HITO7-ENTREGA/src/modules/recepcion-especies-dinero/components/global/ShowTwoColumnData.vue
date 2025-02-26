<template>
<section class="grid col-12">
  <div
    v-for="row in dataCol1"
    :key="row"
    class="col-6"
  >
    <p><strong>{{ row?.label }}</strong>{{ row?.value }}</p>
  </div>
  <div
    v-for="row in dataCol2"
    :key="row"
    class="col-6"
  >
    <p><strong>{{ row?.label }}</strong>{{ row?.value }}</p>
  </div>
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'

defineProps({
  dataCol1: propTypes.array,
  dataCol2: propTypes.array
})
</script>
