<template>
<section class="col-12">
  <div class="grid">
    <div
      v-if="!readOnly"
      class="col-4"
    >
      <FileUpload
        id="upload-seleccionar-archivo"
        :accept="tiposArchivo"
        v-bind="$attrs"
        class="btn-fileupload"
        :max-file-size="16000000"
        mode="basic"
        name="demo[]"
        @select="onSelect"
      />
      <AppInput
        id="nombre-archivo"
        v-model="formData.nombre"
        class="col-12 px-0 pt-3 mb-1"
        disabled
        label="Nombre del archivo"
      />
      <AppInput
        id="descArchivoGrabacion"
        v-model="formData.descripcion"
        class="col-12 px-0"
        label="Descripción del archivo"
      />
      <Button
        class="btn-form p-button-primary"
        :disabled="!formData.nombre"
        label="Adjuntar"
        @click="adjuntarArchivo"
      />
    </div>
    <div :class="readOnly ? 'col-12' : 'col-8'">
      <LoaderSkeleton v-if="isLoading" />
      <TablaDocumentoPorSeccion
        v-else
        :loading="isLoading"
        :rows="dataArchivos?.paginacion?.tamanoPagina"
        :total-records="dataArchivos?.paginacion?.elementosTotales"
        :value="dataArchivos.data"
        @subir-archivo:eliminar="eliminarArchivo"
      />
    </div>
  </div>
</section>
</template>

<script setup>
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import TablaDocumentoPorSeccion from '@/modules/global/components/documentos/TablaDocumentoPorSeccion.vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types/prop.types'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'
import { useBase64 } from '@vueuse/core'
import { defineProps, reactive, defineExpose, defineEmits } from 'vue'

const { toastError } = useAppToast()
const { idCatalogo } = useIdentificacionDenunciaStore()

const emit = defineEmits(['subir-archivo:adjuntar', 'subir-archivo:eliminar'])

const props = defineProps({
  tiposArchivo: propTypes.string,
  dataArchivos: propTypes.array,
  relacionFront: propTypes.string,
  readOnly: Boolean,
  isLoading: Boolean
})

const formData = reactive({
  // subir CDD
  nombre: '',
  base64Data: null,
  mimeType: '',
  descripcion: '',
  claseDocumental: 'Actas',
  idCatalogo: idCatalogo.value,
  idCategoriaDocumento: props.relacionFront, // relacion front
  tamano: '',

  // metadata
  metadata: [{}]
})

const { resetFormData } = useFormValidation({ formData })

async function onSelect (e) {
  const archivo = e.files[0]
  const nombreArchivo = archivo.name
  formData.extensionArchivo = nombreArchivo.split('.').pop()
  console.log(formData.metadata.tipoArchivo)
  if (
    archivo &&
    (formData.extensionArchivo === 'pdf' ||
      formData.extensionArchivo === 'docx' ||
      formData.extensionArchivo === 'xlsx' ||
      formData.extensionArchivo === 'jpg' ||
      formData.extensionArchivo === 'png' ||
      formData.extensionArchivo === 'html' ||
      formData.extensionArchivo === 'mp4')
  ) {
    const tipo = archivo.type
    const tamano = archivo.size
    const base64 = useBase64(archivo)
    await base64.execute()
    const base64String = base64.base64.value

    if (tipo.includes('image')) {
      formData.metadata.tipoArchivo = 'IMAGEN'
    } else if (tipo.includes('application')) {
      formData.metadata.tipoArchivo = 'DOCUMENTO'
    } else if (tipo.includes('video')) {
      formData.metadata.tipoArchivo = 'VIDEO'
    } else if (tipo.includes('audio')) {
      formData.metadata.tipoArchivo = 'AUDIO'
    } else {
      formData.metadata.tipoArchivo = 'OTRO'
    }

    formData.base64Data = base64String.split(',')[1]
    formData.mimeType = tipo
    formData.nombre = nombreArchivo.replace(/\.[^/.]+$/, '')
    formData.tamano = (tamano / 1024).toFixed(0)
  } else {
    toastError(
      `Formato de archivo no permitido; formatos permitidos: pdf, docx, xlsx, jpg, png, html`
    )
  }
}

function adjuntarArchivo () {
  emit('subir-archivo:adjuntar', formData)
}

function eliminarArchivo (data) {
  emit('subir-archivo:eliminar', data)
}
defineExpose({ resetFormData })
</script>
