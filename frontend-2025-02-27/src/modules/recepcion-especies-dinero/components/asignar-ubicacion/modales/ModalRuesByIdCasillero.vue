<template>
<div
  v-if="data.length > 0"
>
  <hr>
  <p
    v-for="r in data"
    :key="r"
    class="my-3"
    style="font-size:1.2em"
  >
    <span class="font-bold">RUE: </span>{{ r.RUE }}
  </p>
</div>
<p
  v-else
  style="font-size:1.2em"
>
  No hay RUE's que utilizan el Casillero
</p>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  data: propTypes.object
})
</script>
