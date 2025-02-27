<template>
<hr>
<main class="grid w-full px-3">
  <ul class="col-12 md:col-6 flex flex-column gap-3">
    <li>
      <strong>Usuario: </strong>
      {{ data?.autor }}
    </li>
    <li>
      <strong>Cargo: </strong>
      {{ data?.rol }}
    </li>
  </ul>
  <ul class="col-12 md:col-6 flex flex-column gap-3">
    <li>
      <strong>Etapa: </strong>
      {{ data?.etapa }}
    </li>
    <li>
      <strong>Fecha: </strong>
      {{ formatDate(data?.fechaCreacion) }}
    </li>
  </ul>
  <ul class="col-12 flex flex-column gap-3">
    <li>
      <strong>Anotación: </strong>
      <p>{{ data?.anotacion || 'Sin Anotación' }}</p>
    </li>
  </ul>
</main>
</template>

<script setup>
import { defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'

defineProps({
  data: propTypes.object
})

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

</script>
<style scoped lang="scss">
li {
  list-style: none;
}
</style>
