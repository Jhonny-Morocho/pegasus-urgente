<template>
<AppForm
  class="col-12 md:col-12 p-fluid"
  :form-submitted="formSubmitted"
  validation-scope="form-destruir-documento"
>
  <div class="grid  ">
    <AppInput
      id="nombreMinistro"
      v-model="formData.nombreMinistro"
      class="col-12 md:col-4 p-fluid"
      label="Nombre Ministro de fe"
      :rules="{ required }"
    />
    <AppInput
      id="cargoMinistro"
      v-model="formData.cargoMinistro"
      class="col-12 md:col-4 p-fluid"
      label="Cargo de Ministro de fe"
      :rules="{ required }"
    />
    <AppDropdown
      id="metodoDestruccion"
      v-model="formData.metodoDestruccion"
      class="col-12 md:col-4 p-fluid"
      label="Método de destrucción"
      option-label="descripcion"
      option-value="id"
      :options="[
        { id: 1, descripcion: 'método1' },
        { id: 2, descripcion: 'método2' }
      ]"
      :rules="{ required }"
    />
  </div>
  <div class="grid formgrid">
    <AppInput
      id="quienDestruye"
      v-model="formData.nombreQuienDestruye"
      class="col-12 md:col-4 p-fluid"
      label="Nombre de quien destruye"
      :rules="{ required }"
    />
    <AppInput
      id="rut"
      v-model="formData.rutQuienDestruye"
      class="col-12 md:col-4 p-fluid"
      :class="!validarCodigo ?? 'text-red-500'"
      label="RUT de quien destruye"
      :rules="{ required, rutValid }"
      @change="validarCodigo"
    />
    <div class="grid col-4 pt-2">
      <AppInput
        id="codigo"
        v-model="formData.codigoBarras"
        class="col-11"
        label="Código de Barras"
        :rules="{ required, minLength: minLength(10) }"
        @change="validarCodigo"
      />
      <div class="grid col-1">
        <i
          v-if="
            datosValidados
          "
          class="pi text-3xl mx-2 pi-check-circle text-green-600 pt-3"
        />
        <i
          v-if="datosValidados === false "
          class="pi text-3xl mx-2 pi-ban text-red-600 pt-3"
        />
      </div>
    </div>
  </div>
  <div class="grid flex justify-content-end">
    <div class="col-12 md:col-4 p-fluid">
      <Button
        class="btn-primary"
        label="Validar Codigo de Barras"
        @click="validarDatos"
      />
    </div>
  </div>
</AppForm>
</template>
<script setup>
// COMPONENTS

// UTILS
import { reactive, defineEmits, ref, defineExpose } from 'vue'

// COMPONSABLES
import { requestUtil } from '@/utils'
import { useSolicitudesEncargadoBodega } from '../../composables'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
const { toastError, toastSuccess } = useAppToast()
const { solicitudesEncargadoBodega_getSolicitudParaReingreso, documentoAgendamiento } = useSolicitudesEncargadoBodega()

// VALUES
const datosValidados = ref(null)
const formData = reactive({
  nombreMinistro: '',
  cargoMinistro: '',
  metodoDestruccion: '',
  quienDestruye: '',
  rut: '',
  observaciones: '',
  codigoBarras: ''
})
const emit = defineEmits(['validacion-datos'])
const { isFormValid, formSubmitted, required, rutValid, minLength } = useFormValidation({ formData, validationScope: 'form-destruir-documento' })

// LOGIC
function validarDatos () {
  if (!isFormValid()) {
    toastError('Revise los campos antes de continuar')
    return
  }

  requestUtil({
    action: solicitudesEncargadoBodega_getSolicitudParaReingreso,
    payload: { codigoBarras: formData.codigoBarras },
    resolve: (data) => {
      console.log(documentoAgendamiento.value.codigoBarras, data.recuperacionArchivo.codigo_barras)
      if (data.recuperacionArchivo.codigo_barras !== documentoAgendamiento.value.codigoBarras) {
        toastError('El Codigo de barras ingresado no corresponde al documento.')
      } else {
        toastSuccess('Datos validados correctamente')
        emit('validacion-datos', true)
        datosValidados.value = true
      }
    },
    reject: () => {
      emit('validacion-datos', false)
      datosValidados.value = false
      toastError('No se encontró el código de barras')
    }
  })
}
defineExpose({ formData })
</script>
