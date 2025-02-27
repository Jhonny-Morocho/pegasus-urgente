<template>
<AppForm
  class="grid"
  :form-submitted="formSubmitted"
  validation-scope="form-datos-deposito-plazo"
>
  <AppInput
    id="numeroOperacion"
    v-model="formData.numeroOperacion"
    class="col-12 md:col-6 lg:col-4"
    label="Número de operación"
    :rules="{ required }"
  />
  <AppCalendar
    id="fechaEmision"
    v-model="formData.fechaEmision"
    class="col-12 md:col-6 lg:col-4"
    date-format="dd-mm-yy"
    label="Fecha de emisión"
    month-navigator
    :rules="{ required }"
    year-navigator
    year-range="1921:2030"
  />
  <AppInputNumber
    id="montoCertificadoDepositoPlazo"
    v-model="formData.montoCertificadoDepositoPlazo"
    class="col-12 md:col-6 lg:col-4"
    label="Monto"
    :min="0"
    :rules="{ required }"
    show-buttons
    :use-grouping="false"
  />
  <AppInput
    id="plazoCertificadoDepositoPlazo"
    v-model="formData.plazoCertificadoDepositoPlazo"
    class="col-12 md:col-6 lg:col-4"
    label="Plazo (en días)"
    :rules="{ required }"
  />
  <AppInput
    id="tasaCertificadoDepositoPlazo"
    v-model="formData.tasaCertificadoDepositoPlazo"
    class="col-12 md:col-6 lg:col-4"
    label="Tasa"
    :rules="{ required }"
  />
  <AppCalendar
    id="fechaVencimiento"
    v-model="formData.fechaVencimiento"
    class="col-12 md:col-6 lg:col-4"
    date-format="dd-mm-yy"
    label="Fecha de vencimiento"
    month-navigator
    :rules="{ required }"
    year-navigator
    year-range="1921:2030"
  />
  <div class="col-12 md:pr-4 lg:pr-5">
    <p>¿Es Renovable?</p>
    <AppSelectButton
      id="esRenovable"
      v-model="formData.esRenovable"
      class="w-12 md:w-6 lg:w-4"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false },
      ]"
      :rules="{ required }"
    />
  </div>
  <AppDropdown
    id="apoderadoUno"
    v-model="formData.apoderadoUno"
    class="col-12 md:col-6 lg:col-4"
    label="Apoderado 1"
    option-label="name"
    option-value="name"
    :options="[{ name: '1' }, { name: '2' }]"
    :rules="{ required }"
    show-clear
  />
  <AppCalendar
    id="fechaVencimiento"
    v-model="formData.fechaVencimiento"
    class="col-12 md:col-6 lg:col-4 lg:mr-1"
    date-format="dd-mm-yy"
    label="Fecha de autorización Apoderado 1"
    month-navigator
    :rules="{ required }"
    year-navigator
    year-range="1921:2030"
  />
  <AppDropdown
    id="apoderadoDos"
    v-model="formData.apoderadoDos"
    class="col-12 md:col-6 lg:col-4"
    label="Apoderado 2"
    option-label="name"
    option-value="name"
    :options="[{ name: '1' }, { name: '2' }]"
    :rules="{ required }"
    show-clear
  />
  <AppCalendar
    id="fechaVencimiento"
    v-model="formData.fechaVencimiento"
    class="col-12 md:col-6 lg:col-4"
    date-format="dd-mm-yy"
    label="Fecha de autorización Apoderado 2"
    month-navigator
    :rules="{ required }"
    year-navigator
    year-range="1921:2030"
  />
  <AppInput
    id="correlativoNomina"
    v-model="formData.correlativoNomina"
    class="col-12 md:col-6 lg:col-4"
    label="Correlativo Nómina"
    :rules="{ required }"
  />
  <AppInput
    id="cuentaOrigen"
    v-model="formData.cuentaOrigen"
    class="col-12 md:col-6 lg:col-4"
    label="Cuenta de origen"
    :rules="{ required }"
  />
  <AppInput
    id="registroAprobacionNomina"
    v-model="formData.registroAprobacionNomina"
    class="col-12 md:col-6 lg:col-4"
    label="Registro de aprobación de la Nómina"
    :rules="{ required }"
  />
  <AppCalendar
    id="fechaHoraAprobacionNomina"
    v-model="formData.fechaHoraAprobacionNomina"
    class="col-12 md:col-6 lg:col-4"
    date-format="dd-mm-yy"
    label="Fecha/Hora de aprobación nómina"
    month-navigator
    :rules="{ required }"
    show-time
    year-navigator
    year-range="1921:2030"
  />
</AppForm>
</template>
<script setup>
import { defineEmits, defineExpose, ref } from 'vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'

const formData = ref({})

const { isFormValid, formSubmitted, required } = useFormValidation({
  formData,
  validationScope: 'form-datos-deposito-plazo'
})

const { toastError } = useAppToast()

const emit = defineEmits(['open-modal'])

function openModalRegistroDeposito () {
  if (!isFormValid()) {
    toastError('Los campos no son correctos')
    return
  }
  emit('open-modal', formData)
}
defineExpose({ openModalRegistroDeposito })
</script>
