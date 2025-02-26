<template>
<AppFieldset
  class="mx-auto"
  legend="Comprobante de Entrega de Dineros"
>
  <ComprobanteEntregaDineros />
</AppFieldset>
<div class="grid mx-auto">
  <div class="col-12 md:col-6 lg:col-4">
    <Button
      class="w-full p-button-outlined"
      :icon="'pi pi-file'"
      icon-pos="right"
      :label="'Vista Previa'"
      @click="abrirModalComprobante"
    />
  </div>
  <div class="col-12 md:col-6 lg:col-4 lg:col-offset-4">
    <Button
      class="w-full p-button-outlined"
      :icon="'pi pi-external-link'"
      icon-pos="right"
      :label="'Firmar Comprobante'"
      @click="abrirModalFirmar"
    />
  </div>
  <div class="upload-container col-12 md:col-6 lg:col-4">
    <FileUpload
      accept="image/*,application/pdf"
      :auto="true"
      cancel-icon="pi pi-times"
      choose-label="Subir Comprobante Firmado"
      class="boton p-button-raised px-5"
      :custom-upload="true"
      :disabled="showProgress"
      :invalid-file-size-message="'{0}: Tamaño máximo de archivo permitido: {1}.'"
      :max-file-size="16000000"
      mode="basic"
      name="file"
      @uploader="onUploader"
    />
    <ProgressBar
      :show-value="showProgress"
      :value="progress"
    />
  </div>
  <div class="col-12 md:col-6 lg:col-4 lg:col-offset-4">
    <Button
      class="w-full"
      :icon="'pi pi-send'"
      icon-pos="right"
      :label="'Enviar Comprobante'"
      @click="enviarComprobante"
    />
  </div>
</div>
<AppBtnNextTeleported
  class="ml-8"
  label="Registrar Salida"
  @click="handleNextStep"
/>
</template>
<script setup>
import { defineEmits, ref } from 'vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import ComprobanteEntregaDineros from '@/modules/recepcion-especies-dinero/components/salida-definitiva-dinero/ComprobanteEntregaDineros.vue'
import { useSubirArchivosStore } from '@/modules/recepcion-especies-dinero/composables'
import { requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'

const emit = defineEmits(['next-step'])

function handleNextStep () {
  emit('next-step', 'registrar-salida')
}

const {
  subirArchivosStore_subirArchivo
} = useSubirArchivosStore()

const { toastError, toastSuccess } = useAppToast()

const progress = ref(0)

const showProgress = ref(false)

function onUploader (e) {
  if (!e.files.length) return
  showProgress.value = true
  const file = e.files.find((e) => e)
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    startProgress()
    const base64 = reader.result.split(',')[1]
    requestUtil({
      action: subirArchivosStore_subirArchivo,
      payload: {
        especies: ['revisar-payload'],
        contenido: base64,
        extensionArchivo: file.type.split('/').pop(),
        titulo: file.name,
        descripcion: file.name,
        procedencia: 'Comprobante Recepcion o rechazo',
        metadata: []
      },
      loader: (l) => (showProgress.value = l),
      resolve: (data) => {
        // retorna el FileId del archivo subido
        console.log(data)
        toastSuccess('El archivo se subió correctamente')
        endProgress()
      },
      reject: () => {
        toastError('Ocurrió un error inesperado, intenta nuevamente rejected')
        endProgress()
      }
    })
  }
  reader.onerror = () => {
    toastError('Ocurrió un error inesperado, intenta nuevamente')
    endProgress()
  }

  const interval = ref(null)
  const startProgress = () => {
    interval.value = setInterval(() => {
      let newValue = (progress.value += 10)
      if (newValue >= 100) {
        newValue = 100
      }
      progress.value = newValue
    }, 700)
  }
  const endProgress = () => {
    progress.value = 0
    clearInterval(interval.value)
    interval.value = null
  }
}
</script>
<style lang="scss" scoped>
::v-deep(.upload-container) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  .boton {
    background-color: #606e84 !important;
    width: 100%;
  }
  .p-progressbar {
    background-color: #606e84;
    margin-top: -2px;
    padding-bottom: 6px;
    border-radius: 0px 0px 4px 4px;
    box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.1);
    max-width: 100%;
  }
  .p-message-error {
    position: absolute;
    top: 32px;
    width: 300px;
  }
}
</style>
