<template>
<div
  v-if="formData.ruc && formData.rit"
  class="p-fluid"
>
  <AppFieldset legend="RUC - RIT">
    <AppInput
      id="ruc"
      v-model="formData.ruc"
      class="col-12 md:col-6"
      disabled
      label="RUC"
    />
    <AppInput
      id="rit"
      v-model="formData.rit"
      class="col-12 md:col-6"
      disabled
      label="RIT"
    />
  </AppFieldset>
</div>
</template>
<script setup>
import { reactive, defineExpose } from 'vue'
const formData = reactive({
  ruc: '',
  rit: ''
})

function populateData (data) {
  Object.assign(formData, data)
}

defineExpose({ populateData })
</script>
