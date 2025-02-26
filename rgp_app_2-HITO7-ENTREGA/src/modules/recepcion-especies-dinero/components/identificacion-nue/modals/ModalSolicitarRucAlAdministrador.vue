<template>
<section>
  <AppForm
    id="modal-solicitudAdministrador"
    class="grid"
    :form-submitted="formSubmitted"
    validation-scope="formSolicitudAdministrador"
  >
    <div class="grid">
      <div class="col-12 md:col-4 p-fluid">
        <AppInput
          id="nue"
          v-model="formData.nue"
          class="col-12 mb-0"
          label="NUE"
          :rules="{ required }"
        />
      </div>
      <div class="col-12 md:col-4 p-fluid">
        <AppInput
          id="folio"
          v-model="formData.folio"
          class="col-12 mb-0"
          label="Folio "
        />
      </div>
      <div class="col-12 md:col-4 p-fluid">
        <AppInput
          id="numeroParteDenuncia"
          v-model="formData.numeroParteDenuncia"
          class="col-12 mb-0"
          label="N° de Parte/Denuncia"
        />
      </div>
      <div class="col-12 md:col-4 p-fluid">
        <AppDropdown
          id="institucion"
          v-model="formData.institucion"
          class="col-12 mb-0"
          label="Institución"
          option-label="name"
          option-value="name"
          :options="[
            { name: 'Opcion 1 (precargada)' },
            { name: 'Opcion 2' }
          ]"
          show-clear
        />
      </div>
      <div class="col-12 md:col-4 p-fluid">
        <AppDropdown
          id="nombreUnidad"
          v-model="formData.nombreUnidad"
          class="col-12 mb-0"
          label="Nombre de la Unidad"
          option-label="name"
          option-value="name"
          :options="[
            { name: 'Opcion 1 (precargada)' },
            { name: 'Opcion 2' }
          ]"
          show-clear
        />
      </div>
      <div class="col-12 md:col-4 p-fluid">
        <AppDropdown
          id="destacamento"
          v-model="formData.destacamento"
          class="col-12 mb-0"
          label="Destacamento"
          option-label="name"
          option-value="name"
          :options="[
            { name: 'Opcion 1 (precargada)' },
            { name: 'Opcion 2' }
          ]"
          show-clear
        />
      </div>
      <div class="col-12 md:col-4 p-fluid">
        <AppDropdown
          id="tipoDocumento"
          v-model="formData.tipoDocumento"
          class="col-12 mb-0"
          label="Tipo de Documento"
          option-label="name"
          option-value="name"
          :options="[
            { name: 'Opcion 1 (precargada)'},
            { name: 'Opcion 2' }
          ]"
          show-clear
        />
      </div>
      <div class="col-12 md:col-4 p-fluid">
        <AppInput
          id="numeroDocumento"
          v-model="formData.numeroDocumento"
          class="col-12 mb-0"
          label="Número de Documento"
        />
      </div>
      <div class="col-12 md:col-4 p-fluid">
        <AppCalendar
          id="fecha"
          v-model="formData.fechaDenunciaFolio"
          class="col-12 mb-0"
          label="Fecha Denuncia/Folio"
        />
      </div>
      <div class="col-12 p-fluid">
        <AppTextarea
          id="observaciones"
          v-model="formData.observaciones"
          class="col-12"
          cols="120"
          label="Observaciones"
          rows="5"
        />
      </div>
    </div>
    <div class="col-12 ml-2">
      <h2 class="mt-4">
        Datos del Solicitante
      </h2>
      <h3 class="my-4 ml-2">
        Usuario Solicitante: {{}}
      </h3>
      <h3 class="my-4 ml-2">
        N° Único Denuncia: {{ formData.numeroDenuncia }}
      </h3>
      <h3 class="my-4 ml-2">
        Fecha/Hora de Solicitud: {{ formatDate(new Date()) }}
      </h3>
    </div>
  </AppForm>
</section>
</template>
<script setup>
// IMPORT COMPONENTS AND FUNCTIONALITIES
import { propTypes } from '@/modules/common/types'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { defineProps, reactive, defineExpose } from 'vue'
import { dateTimeUtil } from '@/utils'

// UTILITIES
const { toastError, TOAST_MESSAGES } = useAppToast()

// VALUES
const formData = reactive(initialData())

const props = defineProps({
  nue: propTypes.number
})

const { isFormValid, formSubmitted, required } = useFormValidation({
  formData,
  validationScope: 'formSolicitudAdministrador'
})

function initialData () {
  return {
    nue: props.nue,
    folio: '',
    numeroParteDenuncia: '',
    institucion: '',
    nombreUnidad: '',
    destacamento: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaDenunciaFolio: '',
    observaciones: '',
    usuarioSolicitante: 'Prueba',
    fechaHoraDeSolicitud: dateTimeUtil.formatToBackend(new Date())
  }
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
// LOGIC
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
