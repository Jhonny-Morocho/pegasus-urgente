<template>
<hr>
<main class="p-4">
  <section class="mb-4">
    <strong>RUC: </strong>
    <Button
      class="p-button-link p-0 cursor-normal"
      :label="props.ruc"
    />
  </section>
  <TablaHistorialAsignaciones />
</main>
<section class="flex flex-row-reverse  px-4 pb-2">
  <Button
    class="p-button-text px-4"
    label="Cerrar"
    @click="dialogRef.close"
  />
</section>
</template>

<script setup>
import { inject, reactive } from 'vue'
import TablaHistorialAsignaciones from '@/modules/termino-postermino/components/tablas/TablaHistorialAsignaciones.vue'

const dialogRef = inject('dialogRef')

const props = reactive({
  ruc: dialogRef.value?.data?.ruc
})

// FALTA GET DE HISTORIAL DE ASIGNACIONES
</script>
<style lang="scss" scoped>
.cursor-normal{
  cursor: default;
}
</style>
