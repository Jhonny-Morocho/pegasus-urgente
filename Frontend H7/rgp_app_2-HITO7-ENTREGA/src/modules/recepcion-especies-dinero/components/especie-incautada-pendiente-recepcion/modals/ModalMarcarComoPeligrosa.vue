<template>
<AppForm
  id="form-especies-incautadas-pendientes"
  :form-submitted="formSubmitted"
  validation-scope="formEspeciesIncautadasPendientes"
>
  <p
    class="ml-2"
  >
    ¿Es Especie peligrosa?
  </p>
  <AppSelectButton
    id="es-peligrosa"
    v-model="formData.esPeligrosa"
    class="col-12 md:col-6 lg:col-4"
    :disabled="readOnly"
    option-label="name"
    option-value="value"
    :options="[
      { name: 'Si', value: true },
      { name: 'No', value: false }
    ]"
  />
  <AppDropdown
    id="id-nivel-peligro"
    v-model="formData.idClasePeligro"
    class="col-12 mb-0"
    :disabled="!formData.esPeligrosa || isLoading"
    label="Clase"
    :loading="isLoading"
    option-label="descripcion"
    option-value="id"
    :options="clasesPeligro"
    :rules="formData.esPeligrosa ? { required } : ''"
    show-clear
  />
</AppForm>
</template>
<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { reactive, defineExpose, watch, ref } from 'vue'

const { clasesPeligro, mantenedor_getClasePeligroEspecie } = useMantenedorStore()

const { toastError, TOAST_MESSAGES } = useAppToast()

function initialData () {
  return {
    esPeligrosa: false,
    idClasePeligro: ''
  }
}

const formData = reactive(initialData())

const { formSubmitted, isFormValid, required } = useFormValidation({
  formData: { formData },
  validationScope: 'formEspeciesIncautadasPendientes'
})
function resetForm () {
  Object.assign(formData, initialData())
}
function retrieveData (retrieve) {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  retrieve?.(formData)
}

const isLoading = ref(false)

watch(
  () => formData.esPeligrosa,
  () => {
    formData.idClasePeligro = null
    if (formData.esPeligrosa === true) {
      requestUtil({
        action: mantenedor_getClasePeligroEspecie,
        loader: (value) => {
          isLoading.value = value
        }
      })
    }
  }
)
defineExpose({ retrieveData, resetForm })
</script>
