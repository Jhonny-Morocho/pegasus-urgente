<template>
<section>
  <div>
    <FileUpload
      id="upload-seleccionar-archivo"
      :accept="tiposArchivo"
      :choose-label="selectLabel || 'Seleccionar Archivo'"
      class="w-full"
      :class="{ 'p-button-success': uploaded }"
      :max-file-size="16000000"
      mode="basic"
      name="demo[]"
      :upload-icon="changeIcon"
      url="urlFilenet"
      @select="onSelect"
    />
  </div>
</section>
</template>

<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types/prop.types'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'
import { useBase64 } from '@vueuse/core'
import {
  defineProps,
  reactive,
  defineExpose,
  defineEmits,
  computed
} from 'vue'

const { toastError } = useAppToast()
const { identificacionDenuncia } = useIdentificacionDenunciaStore()

const emit = defineEmits(['subir-archivo:adjuntar'])

const props = defineProps({
  uploaded: Boolean,
  tiposArchivo: propTypes.string,
  dataArchivos: propTypes.array,
  relacionFront: propTypes.object,
  selectLabel: propTypes.string
})

const formData = reactive({
  // subir CDD
  nombreArchivo: '',
  fileBase64: null,
  mimeType: '',
  descripcion: '',
  claseDocumental: 'Actas',
  idCatalogo: identificacionDenuncia?.value?.idCatalogo,
  idCategoriaDocumento: props.relacionFront,
  tamanoArchivo: '',
  tipo: '',

  // metadata
  metadata: [{}]
})

const { resetFormData } = useFormValidation({ formData })

const changeIcon = computed(() => {
  return props.uploaded ? 'pi pi-check' : 'pi pi-upload'
})

async function onSelect (e) {
  try {
    if (!e.files.length) return
    const archivo = e.files[0]
    if (archivo) {
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

      formData.fileBase64 = base64String.split(',')[1]
      formData.nombreArchivo = nombreArchivo.replace(/\.[^/.]+$/, '')
      // formData.extensionArchivo = nombreArchivo.split('.').pop()
      formData.tamanoArchivo = (tamano / 1024).toFixed(0)
      formData.mimeType = tipo
      adjuntarArchivo()
    }
  } catch (error) {
    toastError('Ocurrió un error inesperado, intenta nuevamente')
  }
}

function adjuntarArchivo () {
  emit('subir-archivo:adjuntar', formData)
}

defineExpose({ resetFormData })
</script>
