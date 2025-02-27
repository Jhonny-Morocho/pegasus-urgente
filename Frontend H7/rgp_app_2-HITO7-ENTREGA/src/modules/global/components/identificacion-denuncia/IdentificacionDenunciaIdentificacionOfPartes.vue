<template>
<div class="p-fluid">
  <AppFieldset legend="Identificación Oficina Partes">
    <AppCalendar
      id="fecha-hora-ingreso-partes"
      v-model="formData.fechaIngresoPartes"
      class="col-12"
      disabled
      label="Fecha/Hora Ingreso Of. Partes"
      show-time
    />
    <AppInput
      id="nombre-funcionario-partes"
      v-model="formData.funcionarioOfPartes"
      class="col-12"
      disabled
      label="Nombre Funcionario Of. Partes"
    />
  </AppFieldset>
</div>
</template>
<script setup>
import { defineExpose, reactive } from 'vue'

const formData = reactive({
  fechaIngresoPartes: '',
  funcionarioOfPartes: ''
})

function populateData (data) {
  Object.assign(formData, data)
}
defineExpose({ formData, populateData })
</script>
