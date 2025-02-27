<template>
<AppFieldset
  class="col-12 mb-6 pb-0"
  legend="Solicitud  de Nue"
>
  <AppForm
    id="solicitudNue"
    class="col-12"
    :form-submitted="formSubmitted"
    validation-scope="formSolicitudNue"
  >
    <div class="col-12 md:col-6 lg:col-4">
      <AppDropdown
        id="cantidad-nue"
        v-model="formData.cantidadNue"
        label="Cantidad de NUE solicitada"
        option-label="name"
        option-value="value"
        :options="decisionCantidadDeNue"
        placeholder
        :rules="{ required }"
        show-clear
      />
    </div>
    <AppTextarea
      id="observacion-solicitud"
      v-model="formData.observacion"
      :auto-resize="true"
      class="col-12 mb-0"
      label="Observaciones de la Solicitud"
      rows="6"
    />
  </AppForm>
</AppFieldset>
</template>

<script setup>
import { defineExpose, reactive } from 'vue'
import { dateTimeUtil } from '@/utils'
import { useFormValidation } from '@/modules/common/composables'

const formData = reactive({
  cantidadNue: null,
  observacion: '',
  fecha: formatFecha(new Date())
})

function formatFecha (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
const { formSubmitted, required, isFormValid, resetFormData } = useFormValidation({
  formData,
  validationScope: 'formSolicitudNue'
})
defineExpose({ formData, isFormValid, resetFormData })

const decisionCantidadDeNue = [
  { name: '5.000', value: '5000' },
  { name: '10.000', value: '10000' },
  { name: '15.000', value: '15000' },
  { name: '20.000', value: '20000' },
  { name: '30.000', value: '30000' },
  { name: '40.000', value: '40000' },
  { name: '50.000', value: '50000' },
  { name: '60.000', value: '60000' },
  { name: '100.000', value: '100000' },
  { name: '150.000', value: '150000' },
  { name: '200.000', value: '200000' }
]
</script>
