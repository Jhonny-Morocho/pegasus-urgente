<template>
<AppForm
  class="col-12 md:col-12 p-fluid "
  :form-submitted="formSubmitted"
  validation-scope="form-devolver-documento"
>
  <div>
    <div class="grid">
      <AppInput
        id="nombreReceptor"
        v-model="formData.nombreReceptor"
        class="col-12 md:col-4 p-fluid"
        label="Nombre de quien recibe"
        :rules="{ required }"
      />
      <AppInput
        id="rutReceptor"
        v-model="formData.rutReceptor"
        class="col-12 md:col-4 p-fluid"
        label="RUT de quien recibe"
        :rules="{ required, rutValid }"
      />
      <AppInput
        id="correoReceptor"
        v-model="formData.correoReceptor"
        class="col-12 md:col-4 p-fluid"
        label="Correo Electrónico de quien recibe"
        :rules="{ required, email }"
      />

      <AppInput
        id="codigo"
        v-model="formData.codigoBarras"
        class="col-4"
        label="Código de Barras"
        :rules="{ required, minLength: minLength(10) }"
        @change="validarCodigo"
      />

      <div class="grid col-3 pl-0 ml-0">
        <i
          v-if="datosValidados "
          class="pi text-3xl mx-2 pi-check-circle text-green-600 pt-3"
        />
        <i
          v-if="datosValidados === false "
          class="pi text-3xl mx-2 pi-ban text-red-600 pt-3"
        />
      </div>
    </div>

    <div class="grid flex justify-content-end">
      <div class="col-12 md:col-4 p-fluid">
        <Button
          class="btn-primary"
          label="Validar Información"
          @click="validarDatos"
        />
      </div>
    </div>
  </div>
</AppForm>
</template>

<script setup>
// COMPONENTS

// UTILS
import { reactive, defineEmits, ref, defineExpose } from 'vue'

// CPOMPOSABLES
import { requestUtil } from '@/utils'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useSolicitudesEncargadoBodega } from '@/modules/catalogo-documental-digital/composables'
const { toastError, toastSuccess } = useAppToast()
const { solicitudesEncargadoBodega_getSolicitudParaReingreso } = useSolicitudesEncargadoBodega()

// VALUES
const datosValidados = ref(null)
const formData = reactive({
  nombreReceptor: '',
  rutReceptor: '',
  correoReceptor: '',
  codigoBarras: ''
})
const emit = defineEmits(['validacion-datos'])
const { isFormValid, formSubmitted, required, rutValid, minLength, email } = useFormValidation({ formData, validationScope: 'form-devolver-documento' })

// LOGIC
function validarDatos () {
  if (!isFormValid()) {
    toastError('Revise los campos antes de continuar')
    return
  }

  requestUtil({
    action: solicitudesEncargadoBodega_getSolicitudParaReingreso,
    payload: { codigoBarras: formData.codigoBarras },
    resolve: () => {
      datosValidados.value = true
      emit('validacion-datos', true)
      toastSuccess('Datos validados correctamente')
    },
    reject: () => {
      datosValidados.value = false
      emit('validacion-datos', false)
      toastError('No se encontró el código de barras')
    }
  })
}
defineExpose({ formData })
</script>
