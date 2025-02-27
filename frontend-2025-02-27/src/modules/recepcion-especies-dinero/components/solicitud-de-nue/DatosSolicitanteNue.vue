<template>
<AppFieldset legend="Datos del Solicitante">
  <div class="grid col-12">
    <div class="col-12">
      <p>
        <strong>Institución solicitante: </strong><span> Policia de Investigaciones de Chile</span>
      </p>
    </div>
    <div class="col-12">
      <p>
        <strong>Nombre solicitante: </strong><span>{{ formData.nombreSolicitante }}</span>
      </p>
    </div>
  </div>
</AppFieldset>
</template>

<script setup>
import { defineExpose } from 'vue'
import { useAppGlobalProperties } from '@/modules/common/composables'
const { $userName } = useAppGlobalProperties()
const formData = {
  nombreSolicitante: $userName.value
}
defineExpose({ formData })
</script>
<style scoped>
p {
  font-size: 1.2em;
}
</style>
