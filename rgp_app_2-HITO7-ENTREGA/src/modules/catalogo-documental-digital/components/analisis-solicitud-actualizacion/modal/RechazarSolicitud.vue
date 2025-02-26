<template>
<AppForm
  :form-submitted="formSubmitted"
  validation-scope="formRechazarSolicitud2"
>
  <div
    v-if="route.path.includes('revision-solicitud-eliminacion')"
    class="flex justify-content-center pb-5"
  >
    <i
      class="pi pi-exclamation-triangle mr-2"
      style="font-size: 2rem"
    />
    <h3 class="">
      ¿Está seguro de Rechazar los documentos seleccionados?
    </h3>
  </div>
  <div class="col-12">
    <AppTextarea
      id="motivoRechazo"
      v-model="formData.motivo"
      cols="30"
      label="Motivo del rechazo"
      rows="5"
      :rules="{ required }"
    />
  </div>
</AppForm>
</template>

<script setup>
import AppForm from '@/modules/common/components/AppForm.vue'
import AppTextarea from '@/modules/common/components/inputs/AppTextarea.vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { reactive, defineExpose } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { toastError } = useAppToast()

const formData = reactive({
  motivo: ''
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'formRechazarSolicitud2'
})

function retrieveData (retrieveCb) {
  if (!isFormValid()) {
    toastError('El motivo de rechazo es obligatorio')
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
