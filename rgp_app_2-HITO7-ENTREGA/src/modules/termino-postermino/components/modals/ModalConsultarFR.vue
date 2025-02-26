<template>
<section class="mt-4">
  <AppForm
    :form-submitted="formSubmitted"
    validation-scope="consultaForm"
  >
    <AppDropdown
      id="tipo-consulta"
      v-model="formData.tipoConsulta"
      class="col-4"
      label="Motivo Consulta"
      :options="consultaOpt"
      :rules="{ required }"
    />
    <AppTextarea
      id="observaciones"
      v-model="formData.observaciones"
      class="col-12"
      cols="150"
      label="Consulta"
      rows="5"
      :rules="{ required }"
    />
    <div class="col-4">
      <Button
        class="col-4 btn-primary"
        icon="pi pi-send"
        icon-pos="right"
        label="Enviar Consulta"
        @click="enviarConsulta"
      />
    </div>
  </AppForm>
</section>
</template>

<script setup>
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { reactive } from 'vue'

const { toastSuccess, toastWarning, TOAST_MESSAGES } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const formData = reactive({
  tipoConsulta: '',
  observaciones: ''
})

const consultaOpt = [
  'Opinión Jurídica',
  'Solicitar Instrucciones',
  'Solicitud de Agrupación',
  'Solicitud de Transferencia',
  'Solicitud de Reasignar'
]

const {
  formSubmitted,
  required,
  isFormValid,
  resetFormData
} = useFormValidation({ formData, validationScope: 'consultaForm' })

async function enviarConsulta () {
  if (!isFormValid()) {
    toastWarning(TOAST_MESSAGES.formInvalid)
    return
  }

  launchConfirmDialog({
    header: 'Consulta de Opinión Jurídica',
    message: '¿Está seguro de Enviar la Consulta?',
    accept: () => {
      console.log('Form: ', formData)
      toastSuccess('Exitoso! Consulta enviada')
      resetFormData()
    }
  })
}
</script>
