<template>
<AppForm
  id="form-marcar-evidencia"
  class="px-3"
  :form-submitted="formSubmitted"
  validation-scope="formMarcarEvidencia"
>
  <div class="col-12 flex justify-content-center">
    <div class="flex flex-column col-12 text-center">
      <p
        id="multiple"
        class="Selection pb-3"
      >
        ¿El Documento es Evidencia?
      </p>
      <AppSelectButton
        id="evidencia"
        v-model="formData.esEvidencia"
        class="col-12 p-fluid"
        option-label="descripcion"
        option-value="value"
        :options="[
          { descripcion: 'Si', value: true },
          { descripcion: 'No', value: false }
        ]"
        :rules="{ required }"
      />
    </div>
  </div>
</AppForm>
</template>

<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { reactive, defineExpose } from 'vue'

const formData = reactive({
  esEvidencia: ''
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'formMarcarEvidencia'
})

const { toastError, TOAST_MESSAGES } = useAppToast()

function retrieveData (retrieveCb) {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  retrieveCb?.(formData)
}

defineExpose({ retrieveData })
</script>
