<template>
<div
  v-if="message"
  class="flex align-items-center pb-4 pr-4"
  style="min-width: 300px"
>
  <i
    class="pi pi-exclamation-triangle"
    style="font-size: 2rem"
  />
  <p class="pl-3">
    {{ message }}
  </p>
</div>
<div class="col-12 pl-6 py-0 data_container">
  <p
    v-for="(data, index) in dataArray"
    :key="index"
  >
    <strong>{{ `${data.label}${data.value != '' ? ':' : ''}` }}</strong> {{ data.value }}
  </p>
</div>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'

defineProps({
  dataArray: propTypes.object,
  message: propTypes.string
})
</script>
<style scoped>
.data_container p:not(:last-child) {
  margin-bottom: 1.25rem;
}
</style>
