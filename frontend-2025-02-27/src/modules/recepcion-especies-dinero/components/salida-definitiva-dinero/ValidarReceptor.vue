<template>
<AppForm
  :id="validationScope"
  class="grid"
  :form-submitted="formSubmitted"
  :validation-scope="validationScope"
>
  <div class="col-12 md:col-6 lg:col-4">
    <p class="ml-2 font-bold">
      Confirmar Asistencia
    </p>
    <AppSelectButton
      id="agendaRetiro"
      v-model="formData.agendaRetiro"
      class="col-12 p-fluid"
      option-label="descripcion"
      option-value="id"
      :options="[
        { descripcion: 'Si', id: 'Si' },
        { descripcion: 'No', id: 'No' }
      ]"
      :rules="{ required }"
    />
  </div>
  <p class="m-auto col-12 md:col-6 lg:col-4">
    <span class="font-bold">Ausencia a la Cita:</span> 0
  </p>
  <AppTextarea
    id="observaciones"
    v-model="formData.observacionesValidar"
    class="col-12"
    cols="150"
    label="Observaciones"
    rows="5"
    :rules="{ required }"
  />
</AppForm>
</template>
<script setup>
import { defineProps, defineExpose } from 'vue'
import { propTypes } from '@/modules/common/types'
import { useFormValidation } from '@/modules/common/composables'
import { useRegistrarsalidaDefinitivaForm } from '@/modules/recepcion-especies-dinero/composables'

const { required } = useFormValidation()

const { formData } = useRegistrarsalidaDefinitivaForm()

defineProps({
  data: propTypes.object,
  formSubmitted: {
    type: Boolean,
    default: false
  },
  validationScope: {
    type: String,
    default: 'elaborarAudiencia'
  }
})

defineExpose(formData)
</script>
