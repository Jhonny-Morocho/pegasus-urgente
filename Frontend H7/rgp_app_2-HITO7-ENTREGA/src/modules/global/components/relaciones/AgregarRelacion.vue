<template>
<section class="col-12">
  <AppForm
    id="relaciones"
    :form-submitted="formSubmitted"
    validation-scope="relaciones"
  >
    <div class="grid">
      <AppDropdown
        id="victima"
        v-model="formData.idPersonaVictima"
        class="col-12 md:col-6 lg:col-4"

        label="Seleccione Victima"
        option-label="nombreCompleto"
        option-value="idPersona"
        :options="victimaOptions"
        placeholder
        show-clear
      />

      <AppDropdown
        id="imputado"
        v-model="formData.idPersonaImputado"
        class="col-12 md:col-6 lg:col-4"

        label="Seleccione Imputado"
        option-label="nombreCompleto"
        option-value="idPersona"
        :options="imputadoOptions"
        placeholder
        show-clear
      />

      <AppDropdown
        id="delito"
        v-model="formData.idDetalleHechoDelictual"
        class="col-12 md:col-6 lg:col-4"

        label="Seleccione Delito"
        option-label="labelDelito"
        option-value="idDetalleHechoDelictual"
        :options="delitoOptions"
        placeholder
        :rules="{
          required,
        }"
        show-clear
      />
    </div>
    <div class="mt-3 flex justify-content-center">
      <Button
        v-if="!isEditando"
        class="btn-form"
        :disabled="isDisabled"
        icon="pi pi-link"
        icon-pos="right"
        label="Agregar Relación"
        :loading="loadingState"
        style="width: 256px"
        @click="emitAgregarRelacion()"
      />

      <div
        v-else
        class="flex"
      >
        <div class="mr-4">
          <Button
            class="p-button-outlined p-button-warning"
            icon="pi pi-times"
            label="Cancelar"
            @click="emitCancelarEdicion()"
          />
        </div>
        <div>
          <Button
            class="p-button-warning"
            icon="pi pi-pencil"
            label="Modificar Relación"
            :loading="loadingState"
            @click="emitAgregarRelacion()"
          />
        </div>
      </div>
    </div>
  </AppForm>
</section>
</template>

<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps, defineEmits, defineExpose, reactive } from 'vue'

const { toastError, TOAST_MESSAGES } = useAppToast()

const formData = reactive({
  idCodigoRelacion: '',
  idDetalleHechoDelictual: '',
  idDenuncia: '',
  idRelacionVictima: '',
  idPersonaVictima: '',
  idRelacionImputado: '',
  idPersonaImputado: '',
  idRelacionDelito: ''
})

const { required, isFormValid, resetFormData, formSubmitted } = useFormValidation({
  formData,
  validationScope: 'relaciones'
})

const emit = defineEmits([
  'relacion:agregar',
  'relacion:editar',
  'relacion:cancelarEdicion'
])

const props = defineProps({
  victimaOptions: propTypes.array,
  imputadoOptions: propTypes.array,
  delitoOptions: propTypes.array,
  loadingState: Boolean,
  isEditando: Boolean,
  isDisabled: { type: Boolean, default: false }

})
function setForm (data) {
  console.log(data)
  const {
    idCodigoRelacion,
    idRelacionDelito,
    idDenuncia,
    idRelacionVictima,
    idRelacionImputado,
    idPersonaVictima,
    idPersonaImputado,
    idDetalleHechoDelictual
  } = data
  formData.idCodigoRelacion = idCodigoRelacion || null
  formData.idDenuncia = idDenuncia || null
  formData.idRelacionVictima = idRelacionVictima
  formData.idRelacionImputado = idRelacionImputado
  formData.idPersonaVictima = idPersonaVictima
  formData.idPersonaImputado = idPersonaImputado
  formData.idDetalleHechoDelictual = idDetalleHechoDelictual
  formData.idRelacionDelito = idRelacionDelito || null
}

function emitAgregarRelacion () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  // Si está editando emite el evento de editar, sino el de agregar
  props.isEditando
    ? emit('relacion:editar', { ...formData })
    : emit('relacion:agregar', { ...formData })
}

function emitCancelarEdicion () {
  resetFormData()
  formData.idPersonaVictima = ''
  formData.idPersonaImputado = ''
  formData.idDetalleHechoDelictual = ''
  emit('relacion:cancelarEdicion')
}

defineExpose({ setForm, resetFormData, emitCancelarEdicion })
</script>
