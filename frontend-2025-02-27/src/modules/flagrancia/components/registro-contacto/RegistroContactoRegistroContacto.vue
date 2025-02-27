<template>
<section>
  <AppFieldset legend="Registro de Contacto">
    <AppInput
      id="folio"
      v-model="formData.folioProcedimiento"
      class="col-12 md:col-6 lg:col-4 mt-auto"
      disabled
      label="Folio"
    />

    <AppCalendar
      id="fechaHoraRegistro"
      v-model="formData.fechaHoraContacto"
      class="col-12 md:col-6 lg:col-4 mt-auto"
      :disabled="soloLectura"
      label="Fecha y hora"
      :rules="{
        required
      }"
      show-time
    />

    <AppInput
      id="glosaContacto"
      v-model="formData.glosaContacto"
      class="col-12 md:col-6 lg:col-4 mt-auto"
      :disabled="soloLectura"
      label="Glosa Contacto"
      :rules="formData.tipoComunicacion === 'Inoficioso' ? { required } : undefined"
      :validation-scope="validationScope"
    />

    <div class="col-12 md:col-6 lg:col-4 pr-3">
      <div class="p-fieldset-legend-text">
        <p class="mb-2 pl-2">
          Canal de Comunicación
        </p>
      </div>
      <AppSelectButton
        id="canalComunicacion"
        v-model="formData.canalComunicacion"
        disabled
        :options="['Telefónico', 'Aplicación']"
      />
    </div>
    <div class="col-12 md:col-6 lg:col-4 lg:col-offset-4 pr-3">
      <div class="p-fieldset-legend-text">
        <p class="mb-2 pl-2">
          Tipo de Comunicación
        </p>
      </div>
      <AppSelectButton
        id="tipoComunicacion"
        v-model="formData.tipoComunicacion"
        :disabled="soloLectura"
        :options="['Oficioso', 'Inoficioso']"
      />
    </div>
  </AppFieldset>
</section>
</template>

<script setup>
import { reactive, defineExpose, defineProps } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types/prop.types'

defineProps({
  validationScope: propTypes.string,
  soloLectura: Boolean
})

const { required } = useFormValidation()

const formData = reactive({
  folioProcedimiento: '',
  fechaHoraContacto: new Date(),
  glosaContacto: '',
  tipoComunicacion: 'Oficioso',
  canalComunicacion: 'Telefónico' // BACKEND LO CAMBIA?
})

function populateData (data) {
  Object.assign(formData, data)
}
defineExpose({ formData, populateData })
</script>
