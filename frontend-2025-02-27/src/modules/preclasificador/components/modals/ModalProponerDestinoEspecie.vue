<template>
<AppForm
  id="modal-completar-info-diligencia"
  class="col-12 grid p-fluid"
  :form-submitted="formSubmitted"
  validation-scope="formDestinoEspecie"
>
  <AppDropdown
    id="destinoEspecie"
    v-model="formData.destinoEspecie"
    class="col-12 md:col-6 "
    label="Destino"
    option-label="name"
    option-value="name"
    :options="[
      { name: 'Custodia Interna' },
      { name: 'Custodia Externa' },
      { name: 'Destruir' },
      { name: 'Devolver' },
      { name: 'DICREP' },
      { name: 'Depósito' }
    ]"
    :rules="{ required }"
    show-clear
  />
  <AppInput
    id="motivoEspecie"
    v-model="formData.motivo"
    class="col-12 md:col-6 "
    label="Motivo (opcional)"
  />
</AppForm>
</template>

<script setup>
// import components and functionalities
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { reactive, defineExpose } from 'vue'

// utilities
const formData = reactive(initialData())
const { toastError, TOAST_MESSAGES } = useAppToast()
// values
const { isFormValid, formSubmitted, required } = useFormValidation({
  formData,
  validationScope: 'formDestinoEspecie'
})

function initialData () {
  return {
    destinoEspecie: '',
    motivo: ''
  }
}
function resetForm () {
  Object.assign(formData, initialData())
}
function retrieveData (retrieveCb) {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  retrieveCb?.(formData)
}
defineExpose({ retrieveData, resetForm })
</script>
