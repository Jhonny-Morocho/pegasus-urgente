<template>
<TabView v-if="imagenProcesoPrincipal && imagenProcesoActual">
  <TabPanel>
    <template #header>
      <span>Vista General</span>
    </template>
    <div
      class="diagrama"
    >
      <img
        alt="DIAGRAMA"
        :src="'data:image/svg+xml;base64,' + imagenProcesoPrincipal"
      >
    </div>
  </TabPanel>
  <TabPanel>
    <template #header>
      <span>Vista SubProceso (Tarea: {{ taskId }})</span>
    </template>
    <div
      class="diagrama"
    >
      <img
        alt="DIAGRAMA"
        :src="'data:image/svg+xml;base64,' + imagenProcesoActual"
      >
    </div>
  </TabPanel>
</TabView>
<div
  v-else
  class="diagrama diagrama-sub"
>
  <div
    class="diagrama"
  >
    <img
      alt="DIAGRAMA"
      :src="'data:image/svg+xml;base64,' + imagenProcesoActual"
    >
  </div>
</div>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'

defineProps({
  taskId: propTypes.number,
  imagenProcesoPrincipal: propTypes.string,
  imagenProcesoActual: propTypes.string
})

</script>
<style lang="scss" scoped>
:deep(svg g text) {
  font-family: sans-serif
}
</style>
