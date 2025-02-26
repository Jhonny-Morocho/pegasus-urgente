<template>
<AppFieldset
  class="mt-4"
  legend="Ingresar datos para Solicitar Salida"
>
  <div class="grid col-12">
    <div class="col-12 md:col-6 pl-4">
      <p><strong>NUE: </strong>{{ especie?.nue ?? 'N/A' }}</p>
      <p><strong>RUE: </strong>{{ especie?.rue ?? 'N/A' }}</p>
      <p><strong>Familia Especie: </strong>{{ mantenedor_getNombreFamiliaEspecie(especie?.familiaEspecie) ?? 'N/A' }}</p>
      <p><strong>Tipo Especie: </strong> {{ mantenedor_getNombreTipoEspecie(especie?.idTipoEspecie) ?? 'N/A' }}</p>
      <p><strong>Motivo de Especie: </strong> {{ 'Incautada (mock)' }}</p>
    </div>
    <div class="col-12 md:col-6 pl-4">
      <p><strong>Estado Especie: </strong>{{ 'En Custodia (mock)' }}</p>
      <p><strong>Cantidad: </strong> {{ especie?.cantidadEspecie }}</p>
      <p><strong>Ubicación Física: </strong>{{ 'Bodega FL (mock)' }}</p>
      <p><strong>Descripción: </strong> {{ especie?.descripcion }}</p>
      <p><strong>Observación: </strong> {{ especie?.observacion }}</p>
    </div>
  </div>
  <AppForm
    class="col-12 grid mt-5"
    :form-submitted="formSubmitted"
    validation-scope="solicitar-salida-especie-form"
  >
    <AppDropdown
      id="plantilla"
      v-model="formData.lugarReceptor"
      class="col-4"
      label="Lugar de Recepción"
      option-label="descripcion"
      option-value="id"
      :options="[
        {id: 'tribunales', descripcion: 'Tribunales'},
        {id: 'fiscalias', descripcion: 'Fiscalias'}
      ]"
      :rules="{ required }"
    />
    <AppInput
      id="plantilla"
      v-model="formData.runReceptor"
      class="col-4"
      label="RUN Receptor"
      :rules="{ required }"
    />
    <AppInput
      id="plantilla"
      v-model="formData.nombreReceptor"
      class="col-4"
      label="Nombre Receptor"
      :rules="{ required }"
    />
    <AppCalendar
      v-if="peritaje"
      id="fecha"
      v-model="formData.fechaAgendada"
      class="col-4"
      label="Fecha Agendada"
      :rules="{ required }"
      show-time
    />
    <AppInput
      v-if="peritaje"
      id="plantilla"
      v-model="formData.plazoSalida"
      class="col-4"
      label="Plazo de Salida"
      :rules="{ required }"
    />
    <AppInput
      id="plantilla"
      v-model="formData.observaciones"
      class="col-12"
      label="Observaciones"
      :rules="{ required }"
    />
  </AppForm>
</AppFieldset>
</template>

<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { defineProps, reactive, defineExpose } from 'vue'

const { mantenedor_getNombreFamiliaEspecie, mantenedor_getNombreTipoEspecie } = useMantenedorStore()

defineProps({
  especie: propTypes.object,
  peritaje: Boolean
})

function initialData () {
  return {
    lugarReceptor: null,
    runReceptor: null,
    nombreReceptor: null,
    observaciones: '',
    fechaAgendada: null,
    plazoSalida: null
  }
}

const formData = reactive(initialData())

const { toastError, TOAST_MESSAGES } = useAppToast()

const {
  formSubmitted,
  required,
  isFormValid
} = useFormValidation({
  formData,
  validationScope: 'solicitar-salida-especie-form'
})

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

<style scoped>
p:not(:last-child) {
  margin-bottom: 1rem;
}
</style>
