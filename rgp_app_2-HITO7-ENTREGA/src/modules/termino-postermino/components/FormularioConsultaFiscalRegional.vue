<template>
<main class="w-full px-4 py-0 mt-2 mx-0">
  <AppForm
    id="formulario-consulta-fr"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="formulario-consulta-fr"
  >
    <AppDropdown
      id="motivo-consulta"
      v-model="formData.idMotivoConsulta"
      class="col-12 md:col-4"
      label="Motivo de Consulta"
      option-label="descripcion"
      option-value="id"
      :options="motivoConsultaOptions"
      :rules="{ required }"
    />
    <AppTextarea
      id="consulta"
      v-model="formData.consulta"
      class="col-12 mt-0"
      label="Consulta"
      rows="5"
      :rules="{ required }"
    />
    <section class="col-offset-9 col-3">
      <Button
        class="btn-form"
        icon="pi pi-send"
        icon-pos="right"
        label="Enviar Consulta"
        @click="handleEnviarConsultaFR"
      />
    </section>
  </AppForm>
</main>
</template>

<script setup>
import { reactive } from 'vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'

// eslint-disable-next-line no-undef
const emit = defineEmits(['enviar-consulta'])

const { toastError, TOAST_MESSAGES } = useAppToast()

const formData = reactive({
  idMotivoConsulta: null,
  consulta: ''
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'formulario-consulta-fr'
})

function handleEnviarConsultaFR () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  emit('enviar-consulta', formData)
}

// FALTA MANTENEDOR
const motivoConsultaOptions = [
  { id: '1', descripcion: 'Opinión Jurídica ' },
  { id: '2', descripcion: 'Solicitar Instrucciones' },
  { id: '3', descripcion: 'Solicitud de Agrupación' },
  { id: '4', descripcion: 'Solicitud de Transferencia' },
  { id: '5', descripcion: 'Solicitud de Reasignar' }
]

</script>
