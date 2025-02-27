<template>
<div class="col-12 md:col-6 lg:col-3">
  <FileUpload
    accept="image/*,application/pdf"
    cancel-icon="pi pi-times"
    choose-label="Seleccionar Archivo"
    class="btn-fileupload w-full"
    :custom-upload="true"
    :disabled="showProgress"
    :max-file-size="16000000"
    mode="basic"
    name="demo[]"
    @select="onSelect"
  />
</div>
<AppForm
  class="col-12 mt-4"
  :form-submitted="formSubmitted"
  validation-scope="formFijacionFotografica"
>
  <div class="grid">
    <AppInput
      id="nombreArchivo"
      v-model="formData.nombreArchivo"
      class="col-12 md:col-6"
      label="Nombre"
      :rules="{ required }"
    />
    <AppInput
      id="descripcionArchivo"
      v-model="formData.descripcionArchivo"
      class="col-12 lg:col-6"
      label="Descripción del Archivo"
    />
  </div>
</AppForm>
<div class="col-12 md:col-6 md:col-offset-6 lg:col-3 lg:col-offset-9 mb-3">
  <Button
    class="w-full"
    :disabled="!dataSubirArchivo || showProgress"
    :icon="showProgress ? 'pi pi-spin pi-spinner' : 'pi pi-paperclip'"
    icon-pos="right"
    label="Adjuntar"
    @click="onUploader"
  />
</div>
</template>
<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { defineProps, reactive, ref, defineEmits, defineExpose } from 'vue'

const props = defineProps({
  showProgress: Boolean,
  procedencia: propTypes.string
})

const formData = reactive({
  nombreArchivo: '',
  descripcionArchivo: ''
})

const { isFormValid, formSubmitted, required } = useFormValidation({
  formData,
  validationScope: 'formFijacionFotografica'
})

const { toastError } = useAppToast()

const dataSubirArchivo = ref(null)

const onSelect = (e) => {
  const file = e.files.find((e) => e)
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    const base64 = reader.result.split(',')[1]
    formData.nombreArchivo = file.name
    dataSubirArchivo.value = {
      titulo: formData.nombreArchivo,
      extensionArchivo: file.type.split('/').pop(),
      contenido: base64,
      metadata: [{ RUC: 12344 }],
      procedencia: props.procedencia
    }
  }
  reader.onerror = () => {
    toastError('Ocurrió un error inesperado, intenta nuevamente')
  }
}

const emit = defineEmits(['agregar-fotografia'])

function onUploader () {
  if (!isFormValid()) {
    toastError('Los campos no son correctos')
    return
  }
  const data = {
    ...dataSubirArchivo.value,
    descripcion: formData.descripcionArchivo,
    titulo: formData.nombreArchivo
  }
  emit('agregar-fotografia', data)
}

function resetform () {
  formData.nombreArchivo = ''
  formData.descripcionArchivo = ''
  formSubmitted.value = false
}

defineExpose({ resetform })
</script>
