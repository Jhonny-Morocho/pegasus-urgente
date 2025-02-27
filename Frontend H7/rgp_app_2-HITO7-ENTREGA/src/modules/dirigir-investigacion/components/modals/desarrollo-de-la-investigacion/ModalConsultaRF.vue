<template>
<AppForm
  id="id-enviar-solicitud-consulta"
  :form-submitted="formSubmitted"
  validation-scope="enviar-solicitud-consulta"
>
  <AppTextarea
    id="comentario"
    v-model="formData.comentario"
    :auto-resize="true"
    class="p-fluid mt-2"
    label="Consulta al Fiscal Regional"
    rows="10"
    :rules="{ required }"
  />

  <div class="flex flex-row-reverse mt-6">
    <Button
      label="Enviar Consulta"
      style="width: 120px"
      @click="closeDialogModal(true)"
    />
    <Button
      class="mr-4 p-button-text p-button-plain"
      icon="pi pi-times"
      icon-pos="right"
      label="Cancelar"
      style="width: 120px"
      @click="closeDialogModal(false)"
    />
  </div>
</AppForm>
</template>

<script setup>
import { inject, reactive } from 'vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'

const { toastError, TOAST_MESSAGES } = useAppToast()

const dialogRef = inject('dialogRef')

const formData = reactive({
  comentario: ''
})

const { isFormValid, formSubmitted, required } = useFormValidation({
  formData,
  validationScope: 'enviar-solicitud-consulta'
})

function closeDialogModal (withData) {
  if (!isFormValid() && withData) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  if (withData) {
    dialogRef.value.close(formData.comentario)
  } else {
    dialogRef.value.close()
  }
}
</script>
