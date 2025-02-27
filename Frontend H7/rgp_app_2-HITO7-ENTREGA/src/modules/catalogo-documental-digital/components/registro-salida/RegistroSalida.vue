<template>
<AppFieldset
  class="p-fluid pb-6"
  legend="Registro de Salida de Documento"
>
  <AppForm
    id="crearDocumento"
    class="col-12"
    :form-submitted="formSubmitted"
    validation-scope="RegistroSalidaDocumento"
  >
    <section>
      <div class="col-12 md:col-12 p-fluid">
        <div class="grid formgrid">
          <div class="col-4">
            <AppDropdown
              id="entrega"
              v-model="formData.entrega"
              :disabled="isLoading"
              label="A quien se le entrega"
              option-label="descripcion"
              option-value="id"
              :options="funcionarios"
              :rules="{ required }"
              show-clear
            />
          </div>
          <div class="col-4">
            <AppInput
              id="funcionario"
              v-model="formData.funcionario"
              :disabled="isLoading"
              label="Seleccione Funcionario"
              :rules="{ required }"
            />
          </div>
          <AppCalendar
            id="fechaEntrega"
            v-model="formData.fechaEntrega"
            class="col-4"
            date-format="dd-mm-yy"
            :disabled="isLoading"
            label="Fecha de Entrega"
            :max-date="new Date('2100-12-31')"
            :min-date="new Date()"
            :rules="{ required }"
          />
        </div>
      </div>
      <div
        v-if="tipoSalida === '3542FA34-27B5-4869-8D87-EE17D9D06CCA'"
        class="col-12 md:col-12 p-fluid"
      >
        <div class="grid formgrid">
          <AppInputNumber
            id="plazo"
            v-model="formData.plazo"
            class="col-4"
            :disabled="isLoading"
            label="Plazo"
            :min="0"
            :rules="{ required }"
            show-buttons
            :step="1"
            :use-grouping="false"
          />
          <AppCalendar
            id="fechaDevolucion"
            v-model="formData.fechaDevolucion"
            class="col-4"
            date-format="dd-mm-yy"
            :disabled="isLoading"
            label="Fecha de Devolución Requerida"
            :max-date="new Date('2100-12-31')"
            :min-date="fechaSumada"
            :rules="{ required }"
          />
        </div>
      </div>
      <div class="col-12 md:col-12 p-fluid">
        <div>
          <AppTextarea
            id="observaciones"
            v-model="formData.observaciones"
            :auto-resize="true"
            class="p-fluid col-12"
            cols="50"
            :disabled="isLoading"
            placeholder="Observaciones"
            rows="10"
          />
        </div>
      </div>
    </section>
  </AppForm>
</AppFieldset>
</template>
<script setup>
import { reactive, defineExpose, defineProps, watch, onMounted } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { useMantenedorCDD } from '../../composables'

const formData = reactive({
  entrega: '',
  funcionario: '',
  fechaEntrega: new Date(),
  plazo: 30,
  fechaDevolucion: '',
  observaciones: ''
})
const { funcionarios } = useMantenedorCDD()
watch(formData, () => {
  formData.fechaDevolucion = new Date(formData.fechaEntrega)
  formData.fechaDevolucion.setDate(
    formData.plazo + formData.fechaEntrega.getDate()
  )
})

defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  tipoSalida: propTypes.Object
})
const { formSubmitted, required, isFormValid, resetFormData } =
  useFormValidation({
    formData,
    validationScope: 'RegistroSalidaDocumento'
  })

onMounted(() => {
  formData.fechaDevolucion = new Date(formData.fechaEntrega)
  formData.fechaDevolucion.setDate(
    formData.plazo + formData.fechaEntrega.getDate()
  )
})

defineExpose({ formData, isFormValid, resetFormData })
</script>

<style scoped>
.Selection {
  font-size: 18px;
  padding-bottom: 15px;
  text-align: start;
}
</style>
