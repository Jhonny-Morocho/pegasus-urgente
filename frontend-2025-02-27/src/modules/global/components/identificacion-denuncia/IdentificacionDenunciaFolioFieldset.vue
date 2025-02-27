<template>
<div class="p-fluid">
  <AppFieldset legend="Folio">
    <AppInput
      id="folio"
      v-model="formData.folio"
      class="col-12"
      disabled
      label="Folio"
    />
  </AppFieldset>
</div>
</template>
<script setup>
import { reactive, defineExpose } from 'vue'
const formData = reactive({
  folio: ''
})
function populateData (data) {
  Object.assign(formData, data)
}

defineExpose({ populateData, formData })
</script>
