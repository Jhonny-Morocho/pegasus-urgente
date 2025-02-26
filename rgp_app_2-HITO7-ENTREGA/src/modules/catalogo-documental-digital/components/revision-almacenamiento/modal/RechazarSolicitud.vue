<template>
<section>
  <AppForm
    :form-submitted="formSubmitted"
    validation-scope="formRechazarSolicitud"
  >
    <AppDropdown
      id="DestinoDocumento"
      v-model="formData.destinoDocumento"
      class="col-8 p-fluid"
      label="Destino de documento físico"
      option-label="descripcion"
      option-value="id"
      :options="destinosDocumentosFisicos"
      :rules="{ required }"
      show-clear
    />
    <div class="col-12">
      <AppTextarea
        id="motivoRechazo"
        v-model="formData.motivoRechazo"
        cols="30"
        label="Motivo del rechazo"
        rows="5"
        :rules="{ required }"
      />
    </div>
  </AppForm>
</section>
</template>

<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { reactive, defineExpose } from 'vue'
import AppTextarea from '@/modules/common/components/inputs/AppTextarea.vue'
import { useMantenedorCDD } from '@/modules/catalogo-documental-digital/composables'

const formData = reactive({
  destinoDocumento: '',
  motivoRechazo: ''
})
const { destinosDocumentosFisicos } = useMantenedorCDD()
const { toastError, TOAST_MESSAGES } = useAppToast()
const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'formRechazarSolicitud'
})

function retrieveData (retrieveCb) {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  retrieveCb?.(formData)
}

defineExpose({ retrieveData })
</script>

<style scoped>
.p-inputtext {
  width: 100%;
}
</style>
