<template>
<section>
  <AppForm
    id="adjuntar-doc"
    :form-submitted="formSubmitted"
    validation-scope="formDocumentos"
  >
    <div class="col-12 grid w-full">
      <div class="col-12">
        <FileUpload
          id="seleccionar-archivo"
          accept="image/*,video/*,audio/*,application/*"
          choose-label="Seleccionar Archivo"
          class="btn-fileupload"
          :disabled="isEditando"
          :max-file-size="16000000"
          mode="basic"
          name="demo[]"
          @select="onSelect"
        />
      </div>
      <div class="col-12 grid">
        <div class="col-4">
          <AppInput
            id="nombre-archivo"
            v-model="formData.nombre"
            class="col-12 px-0"
            label="Nombre del Archivo"
            :rules="{ required }"
          />
          <AppDropdown
            id="tipo-antecedente"
            v-model="formData.idTipoAntecedente"
            class="col-12 px-0"
            label="Tipo Antecedente"
            option-label="descripcion"
            option-value="id"
            :options="claseDocumental"
            :rules="{
              required
            }"
            show-clear
          />
          <AppDropdown
            id="origen-archivo"
            v-model="formData.metadata[0].procedencia"
            class="col-12 px-0"
            label="Origen"
            option-label="descripcion"
            option-value="id"
            :options="procedencia"
            :rules="{ required }"
            show-clear
          />
        </div>
        <div class="col-4">
          <AppInput
            id="tipo-archivo"
            v-model="formData.mimeType"
            class="col-12 px-0"
            :disabled="isEditando"
            label="Tipo"
            :rules="{ required }"
          />
          <AppInput
            id="extension-archivo"
            v-model="formData.tipo"
            class="col-12 px-0"
            disabled
            label="Extensión"
          />
          <AppInput
            id="tamano-archivo"
            v-model="formData.tamano"
            class="col-12 px-0"
            disabled
            label="Tamaño"
          />
        </div>
        <div class="col-4">
          <AppInput
            id="ubicacion-archivo"
            v-model="formData.ubicacion"
            class="col-12 px-0"
            disabled
            label="Ubicación"
          />
          <AppTextarea
            id="descripcion-archivo"
            v-model="formData.descripcion"
            class="col-12 px-0 mb-0 pb-0"
            label="Descripción"
            rows="5"
            :rules="{ required }"
          />
        </div>
      </div>
    </div>
    <div
      v-if="!isEditando"
      class="flex justify-content-center mt-3 mb-5"
    >
      <Button
        class="btn-form w-auto"
        :disabled="disabled"
        icon="pi pi-paperclip"
        icon-pos="right"
        label="Adjuntar Documento"
        style="min-width: 256px"
        @click="emitAdjuntarDocumento"
      />
    </div>
    <div
      v-else
      class="flex justify-content-center mt-3 mb-5"
    >
      <Button
        class="p-button-warning p-button-outlined mr-3"
        icon="pi pi-times"
        icon-pos="left"
        label="Cancelar"
        style="width: auto"
        @click="cancelarEdicion"
      />
      <Button
        class="p-button-warning"
        icon="pi pi-pencil"
        icon-pos="left"
        label="Modificar Documento"
        style="width: auto"
        @click="emitAdjuntarDocumento"
      />
    </div>
  </AppForm>
</section>
</template>

<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types/prop.types'
import {
  reactive,
  defineEmits,
  defineExpose,
  defineProps,
  watch,
  ref,
  onMounted
} from 'vue'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'
import { useBase64 } from '@vueuse/core'
import { requestUtil } from '@/utils'
import { useMantenedorCDD } from '@/modules/catalogo-documental-digital/composables'

const { idCatalogo } = useIdentificacionDenunciaStore()
const {
  procedencia,
  claseDocumental,
  mantenedorCDD_getProcedencia,
  mantenedorCDD_getClaseDocumental
} = useMantenedorCDD()
const { toastError, TOAST_MESSAGES } = useAppToast()

const emit = defineEmits([
  'adjuntar-documento:adjuntar',
  'adjuntar-documento:editar',
  'adjuntar-documento:cancelar-edicion'
])

const props = defineProps({
  isEditando: Boolean,
  dataDocumento: propTypes.object,
  claseDocumental: propTypes.object
})

const formData = reactive({
  nombre: '',
  base64Data: null,
  mimeType: '',
  descripcion: '',
  claseDocumental: 'Actas',
  idCatalogo: idCatalogo.value,
  idCategoriaDocumento: '', // relacion front
  idTipoAntecedente: '', // clase documnetal
  tamano: '',
  tipo: '',

  // metadata
  metadata: [
    {
      procedencia: '' // origen
    }
  ]
})

const { formSubmitted, required, isFormValid, resetFormData } =
  useFormValidation({
    formData,
    validationScope: 'formDocumentos'
  })

const disabled = ref(true)

async function onSelect (e) {
  try {
    if (!e.files.length) return
    disabled.value = false
    const archivo = e.files[0]
    const nombreArchivo = archivo.name
    const tamano = archivo.size
    const tipo = archivo.type
    const base64 = useBase64(archivo)
    await base64.execute()
    const base64String = base64.base64.value

    if (tipo.includes('image')) {
      formData.tipo = 'IMAGEN'
    } else if (tipo.includes('application')) {
      formData.tipo = 'DOCUMENTO'
    } else if (tipo.includes('video')) {
      formData.tipo = 'VIDEO'
    } else if (tipo.includes('audio')) {
      formData.tipo = 'AUDIO'
    } else {
      formData.tipo = 'OTRO'
    }

    formData.mimeType = archivo.type
    formData.base64Data = base64String.split(',')[1]
    formData.nombre = nombreArchivo.replace(/\.[^/.]+$/, '')
    formData.tamano = (tamano / 1024).toFixed(0)
  } catch (error) {
    toastError('Ocurrió un error inesperado, intenta nuevamente')
  }
}

function emitAdjuntarDocumento () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  if (!props.isEditando) {
    emit('adjuntar-documento:adjuntar', { ...formData })
    disabled.value = ''
  } else {
    emit('adjuntar-documento:editar', { ...formData })
    disabled.value = ''
  }
}

function cancelarEdicion () {
  emit('adjuntar-documento:cancelar-edicion')
}

function populateForm (data) {
  console.log('POPULATE: ', data)
  formData.nombre = data.nombre
  formData.tamano = data.tamano
  formData.mimeType = data.mimeType
  formData.descripcion = data.descripcion
  formData.idTipoAntecedente = data.idTipoAntecedente
  formData.tipo = data.tipo
  formData.metadata[0].procedencia = data.idOrigen.toUpperCase()
  console.log(formData.metadata.procedencia)
}

watch(props, () => {
  if (props?.dataDocumento) {
    populateForm(props.dataDocumento)
  }
})

onMounted(async () => {
  await requestUtil({ action: mantenedorCDD_getProcedencia })
  await requestUtil({ action: mantenedorCDD_getClaseDocumental })
  console.log(procedencia.value)
})

defineExpose({ resetFormData, formData })
</script>
