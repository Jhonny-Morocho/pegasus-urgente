<template>
<AppFieldset
  class="p-fluid"
  legend="Agendamiento para devolución"
>
  <AppForm
    id="formAgendamiento"
    class="col-12"
    :form-submitted="formSubmitted"
    validation-scope="formAgendamiento"
  >
    <div class="grid col-12 p-fluid">
      <div class="col-4">
        <h4 class="col-12 mb-3 text-center">
          ¿Contacto Efectivo?
        </h4>
        <AppSelectButton
          id="efectivo"
          v-model="formData.contactoEfectivo"
          class="col-12 p-fluid"
          option-label="descripcion"
          option-value="id"
          :options="[
            { descripcion: 'Si', id: 1 },
            { descripcion: 'No', id: 0 }
          ]"
          :rules="{ required }"
        />
      </div>

      <div class="col-4">
        <h4 class="col-12 mb-3 text-center">
          ¿Agenda Retiro?
        </h4>
        <AppSelectButton
          id="retiro"
          v-model="formData.agendaRetiro"
          class="col-12 p-fluid"
          :disabled="formData.contactoEfectivo !== 1"
          option-label="descripcion"
          option-value="id"
          :options="[
            { descripcion: 'Si', id: 1 },
            { descripcion: 'No', id: 0 }
          ]"
        />
      </div>

      <div class="col-4 mt-6">
        <AppCalendar
          id="devolucion"
          v-model="formData.fechaDevolucion"
          class="pt-2"
          :disabled="formData.agendaRetiro !== 1"
          label="Fecha/Hora de Devolución"
          :max-date="new Date('2100-12-31')"
          :min-date="new Date()"

          show-time
        />
      </div>
    </div>
  </AppForm>
</AppFieldset>
</template>
<script setup>
// COMPONENTS

// UTILS
import { useFormValidation } from '@/modules/common/composables'
import { reactive, defineExpose } from 'vue'

// COMPOSABLES

// VALUES
const formData = reactive({
  contactoEfectivo: null,
  agendaRetiro: null,
  fechaDevolucion: ''
})
const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'formAgendamiento'
})

// LOGIC

defineExpose({ formData, isFormValid })

</script>
