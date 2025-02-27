<template>
<AppForm
  id="enviarsolicitud"
  class="grid col-12 m-auto"
  :form-submitted="formSubmitted"
  validation-scope="enviarsolicitud"
>
  <p class="col-12 lg:col-4 my-auto">
    <span>Fecha agendada de inspección:</span>{{ dateTimeUtil.formatToFrontend(fechaAgendadaInspeccion.fechaAgendada) }}
  </p>
  <AppCalendar
    id="Hora de Inicio Inspección"
    v-model="formData.horaInicioInspeccion"
    class="col-12 md:col-6 lg:col-4"
    label="Hora de Inicio Inspección"
    :max-date="null"
    :rules="{ required }"
    time-only
  />
  <AppCalendar
    id="Hora de Término Inspección"
    v-model="formData.horaTerminoInspeccion"
    class="col-12 md:col-6 lg:col-4"
    label="Hora de Término Inspección"
    :max-date="null"
    :min-date="formData.horaInicioInspeccion"
    :rules="{ required }"
    time-only
  />
  <AppInput
    id="nombre-responsable"
    v-model="formData.nombreResponsable"
    class="col-12 md:col-6 lg:col-4"
    label="Nombre del Responsable"
    :rules="{ required }"
  />
  <AppInput
    id="nro-documento-responsable"
    v-model="formData.nroDocumentoResponsable"
    class="col-12 md:col-6 lg:col-4"
    label="N° Documento del Responsable"
    :rules="{ required }"
  />
  <AppTextarea
    id="observaciones"
    v-model="formData.observaciones"
    auto-resize
    class="col-12"
    cols="85"
    label="Observaciones"
    rows="4"
  />
  <div class="col-12 flex justify-content-center md:justify-content-end">
    <Button
      class="btn-form w-auto"
      :disabled="registrandoLoading"
      :icon="registrandoLoading ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
      icon-pos="right"
      label="Registrar Datos"
      style="min-width: 256px"
      @click="registrarDatos"
    />
  </div>
</AppForm>
</template>
<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { defineEmits, reactive, defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'

const formData = reactive({
  horaInicioInspeccion: '',
  horaTerminoInspeccion: '',
  nombreResponsable: '',
  nroDocumentoResponsable: '',
  observaciones: ''
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'enviarsolicitud'
})

const { toastError, TOAST_MESSAGES } = useAppToast()

const props = defineProps({
  fechaAgendadaInspeccion: propTypes.string,
  registrandoLoading: Boolean
})

const emit = defineEmits([
  'inspeccion:registrar'
])

function registrarDatos () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  const payload = {
    ...formData,
    fechaAgendadaInspeccion: dateTimeUtil.formatToBackend(props.fechaAgendadaInspeccion.fechaAgendada),
    horaInicioInspeccion: dateTimeUtil.formatToBackendWithTime(formData.horaInicioInspeccion),
    horaTerminoInspeccion: dateTimeUtil.formatToBackendWithTime(formData.horaTerminoInspeccion)
  }
  emit('inspeccion:registrar', payload)
}
</script>
<style scoped>
span {
  font-weight: bold;
  margin-right: 6px;
}
</style>
