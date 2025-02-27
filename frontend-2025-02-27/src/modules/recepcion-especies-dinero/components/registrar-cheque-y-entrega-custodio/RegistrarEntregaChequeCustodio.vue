<template>
<section>
  <AppFieldset legend="Registrar Entrega de Cheque">
    <p>Número de serie: </p>
    <AppForm
      class="grid col-12 lg:col-8 pr-0"
      :form-submitted="formSubmitted"
      validation-scope="form-registrar-entrega-cheque"
    >
      <AppCalendar
        id="fechaDeFirmaCheque"
        v-model="formData.fechaDeFirmaCheque"
        class="col-12 md:col-6"
        date-format="dd-mm-yy"
        label="Fecha de Firma de Cheque"
        month-navigator
        :rules="{ required }"
        year-navigator
        year-range="1921:2030"
      />
      <AppInput
        id="apoderadoUno"
        v-model="formData.apoderadoUno"
        class="col-12 md:col-6"
        label="Apoderado 1"
        :rules="{ required }"
      />
      <AppInput
        id="apoderadoDos"
        v-model="formData.apoderadoDos"
        class="col-12 md:col-6"
        label="ApoderadoDos"
        :rules="{ required }"
      />
      <AppInput
        id="custodioAQuienEntregaCheque"
        v-model="formData.custodioAQuienEntregaCheque"
        class="col-12 md:col-6"
        label="Custodio a quién entrega el cheque"
        :rules="{ required }"
      />
      <AppCalendar
        id="fechaDeEntregaACustodio"
        v-model="formData.fechaDeEntregaACustodio"
        class="col-12 md:col-6"
        date-format="dd-mm-yy"
        label="Fecha de Firma de Entrega a Custodio"
        month-navigator
        :rules="{ required }"
        year-navigator
        year-range="1921:2030"
      />
      <AppTextarea
        id="observacionesDelEslabon"
        v-model="formData.observaciones"
        :auto-resize="true"
        class="col-12 p-fluid"
        cols="100"
        label="Observaciones"
        rows="3"
      />
    </AppForm>
    <div class="upload-container">
      <FileUpload
        accept="image/*,application/pdf"
        cancel-icon="pi pi-times"
        choose-label="Subir Cheque Firmado"
        class="boton p-button-raised px-5"
        :custom-upload="true"
        :disabled="showProgress"
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
    <div class="upload-container">
      <FileUpload
        accept="image/*,application/pdf"
        cancel-icon="pi pi-times"
        choose-label="Subir Comprobante de Entrega"
        class="boton p-button-raised px-5"
        :custom-upload="true"
        :disabled="showProgress"
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
  </AppFieldset>
  <AppFooterBtns
    label="Generar Cheque"
    @back-step="handleBackStep"
    @next-step="registrarEntregaCheque()"
  />
</section>
</template>
<script setup>
import { ref } from 'vue'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import { requestUtil } from '@/utils'
import { useComprobanteDeRecepcionRechazoStore, useSalidaDinero } from '../../composables'
import { useRouter } from 'vue-router'

const formData = ref({
  fechaDeFirmaCheque: '',
  numeroDeSerie: '',
  apoderadoUno: '',
  apoderadoDos: '',
  custodioAQuienEntregaCheque: '',
  fechaDeEntregaACustodio: '',
  observaciones: ''
})
const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-registrar-entrega-cheque'
})
const { toastError, toastSuccess } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const { salidaDinero_registrarEntregaCheque } = useSalidaDinero()
const router = useRouter()
function registrarEntregaCheque () {
  if (!isFormValid()) {
    toastError('Los campos no son correctos')
  }
  launchConfirmDialog({
    message: `¿Está seguro de Registrar Emisión de Cheque?`,
    accept: () => {
      requestUtil({
        action: salidaDinero_registrarEntregaCheque,
        payload: {
          tareaId: 1,
          numeroSerie: 'string',
          fechaFirma: formData.value.fechaDeFirmaCheque,
          apoderado1: formData.value.apoderadoUno,
          apoderado2: formData.value.apoderadoDos,
          custodio: 'string',
          fechaEntrega: formData.value.fechaDeEntregaACustodio,
          observaciones: formData.value.observaciones,
          idChequeFilenet: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          idComprobanteEntregaFilenet: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        }
      })
      router.push({ name: 'BandejaCustodio' })
    }
  })
}
const progress = ref(0)

const showProgress = ref(false)
const { comprobante, stepComprobanteDeRecepcionRechazo_subirArchivo } =
  useComprobanteDeRecepcionRechazoStore()

// REVISAR COMPROBNTE
function onUploader (e) {
  const especiesIds = comprobante.value.especiesRecepcionadas.filter(
    (e) => e.idEspecie
  )
  if (!e.files.length) return
  showProgress.value = true
  const file = e.files.find((e) => e)
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    startProgress()
    const base64 = reader.result.split(',')[1]
    requestUtil({
      action: stepComprobanteDeRecepcionRechazo_subirArchivo,
      payload: {
        especies: especiesIds.map((e) => e.idEspecie),
        contenido: base64,
        extensionArchivo: file.type.split('/').pop(),
        titulo: file.name,
        descripcion: file.name,
        procedencia: 'Comprobante Recepcion o rechazo',
        metadata: [{ RUC: comprobante.value.ruc }]
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
