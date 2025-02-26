<template>
<AppFieldset legend="Acta Salida por Transferencia">
  <ShowTwoColumnData
    :data-col1="dataSalidasolicitudTransferencia.dataColTrans1"
    :data-col2="dataSalidasolicitudTransferencia.dataColTrans2"
  />
</AppFieldset>
<AppFieldset legend="Especies Involucradas">
  <EspeciesInvolucradas :especies-dineros="dataActaSalidaTransferencia?.especiesInvolucradas" />
</AppFieldset>
<div class="grid mb-4 px-3">
  <Button
    class="px-4 col-12 my-2 md:col-5 lg:col-3 p-button-outlined"
    :icon="'pi pi-file'"
    icon-pos="right"
    :label="'Vista Previa'"
    @click="abrirModalComprobante"
  />
  <Button
    class="px-4 col-12 my-2 md:col-5 md:col-offset-2 lg:col-3 lg:col-offset-6 p-button-outlined"
    :icon="'pi pi-sign-out'"
    icon-pos="right"
    :label="'Firmar Comprobante'"
    @click="abrirModalFirmar"
  />
  <div class="upload-container">
    <FileUpload
      accept="image/*,application/pdf"
      cancel-icon="pi pi-times"
      choose-label="Subir Comprobante Firmado"
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
</div>
<AppBtnNextTeleported
  label="Registrar Salida"
  @click="handleNextStep"
/>
</template>
<script setup>
import {
  useAppDialog,
  useAppToast,
  useConfirmDialog
} from '@/modules/common/composables'
import ShowTwoColumnData from '@/modules/recepcion-especies-dinero/components/global/ShowTwoColumnData.vue'
import EspeciesInvolucradas from '@/modules/recepcion-especies-dinero/components/registro-salida-temporal/EspeciesInvolucradas.vue'
import VistaPreviaComprobanteActaSalidaTemporal from '@/modules/recepcion-especies-dinero/components/registro-salida-temporal/modals/VistaPreviaComprobanteActaSalidaTemporal.vue'
import FirmarComprobante from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/modals/FirmarComprobante.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { ref } from 'vue'
import { requestUtil } from '@/utils'
import {
  useComprobanteDeRecepcionRechazoStore,
  useIngresoDinero,
  useRegistroSalida
} from '../../composables'
import { useRouter } from 'vue-router'

const { launchDialog } = useAppDialog()
const { dataActa, registroSalida_registroSalidaTransferencia, dataSalidaTransferencia, dataActaSalidaTransferencia, datosRegistroSalidaTemporal } = useRegistroSalida()
const { comprobante, stepComprobanteDeRecepcionRechazo_subirArchivo } =
  useComprobanteDeRecepcionRechazoStore()
const router = useRouter()

const { launchConfirmDialog } = useConfirmDialog()
const { toastError, toastSuccess } = useAppToast()
const { stepIngresoDinero_getGenerarDataQr } = useIngresoDinero()
const foto = ref()
const idFilenet = ref()
const isLoading = ref(false)
const dataSalidasolicitudTransferencia = {
  dataColTrans1: [
    { label: 'RUC: ', value: dataActaSalidaTransferencia.value.salidaTransferencia.RUC },
    { label: 'Fiscal de Destino: ', value: dataActaSalidaTransferencia.value.salidaTransferencia?.fiscalDestino },
    { label: 'Fiscal que Autoriza: ', value: dataActaSalidaTransferencia.value.salidaTransferencia?.fiscalQueAutoriza },
    { label: 'Fiscalía de Destino: ', value: dataActaSalidaTransferencia.value.salidaTransferencia?.fiscaliaDestino },
    { label: 'Fiscal Origen: ', value: dataActaSalidaTransferencia.value.salidaTransferencia?.fiscalOrigen },
    { label: 'Receptor: ', value: dataActaSalidaTransferencia.value.salidaTransferencia?.receptor },
    { label: 'Fiscalía Origen: ', value: dataActaSalidaTransferencia.value.salidaTransferencia?.fiscaliaOrigen },
    { label: 'RUN Recepctor: ', value: dataActaSalidaTransferencia.value.salidaTransferencia?.runReceptor },
    { label: 'Custodio de Origen: ', value: dataActaSalidaTransferencia.value.salidaTransferencia?.custodioOrigen }

  ],
  dataColTrans2: [
    { label: 'RUN Custodio de Origen: ', value: dataActaSalidaTransferencia.value.salidaTransferencia?.runCustodioOrigen },
    { label: 'Observaciones: ', value: dataActaSalidaTransferencia.value.salidaTransferencia?.observaciones }
  ]
}
function generarQr (dataActa) {
  isLoading.value = false
  if (dataActa !== {}) {
    requestUtil({
      action: stepIngresoDinero_getGenerarDataQr,
      // payload para el QR
      payload: {
        qr: `RUC: ${dataActaSalidaTransferencia?.value?.salidaTransferencia?.RUC}, NUE: ${dataActaSalidaTransferencia?.value?.salidaTransferencia?.nue}`
      },
      resolve: (res) => {
        foto.value = res.qrBase64
      },
      reject: (e) => toastError(e),
      loader: (l) => {
        isLoading.value = l
      }
    })
  }
}
generarQr(dataActa.value)

function abrirModalComprobante () {
  console.log('salida')
  const fotoQr = foto.value
  const title = 'Comprobante de Acta Salida'
  launchDialog({
    component: VistaPreviaComprobanteActaSalidaTemporal,
    width: '80%',
    header: title,
    showHeader: false,
    cancelLabel: 'Cerrar',
    props: {
      title,
      dataActa,
      fotoQr,
      dataActaSalidaTransferencia,
      esTransferencia: true
      // dataComprobanteTermino: dataComprobanteTermino.value
    }
  })
}
function handleNextStep () {
  console.log('acta data', datosRegistroSalidaTemporal.value)
  launchConfirmDialog({
    header: 'Registrar Salida por Transferencia',
    message: '¿Está seguro de Registrar Salida por Transferencia?',
    acceptLabel: 'Salir',
    accept: () => {
      requestUtil({
        action: registroSalida_registroSalidaTransferencia,
        payload: {
          tareaId: dataSalidaTransferencia.value.tarea.taskId,
          idSalidaTemporal: dataActaSalidaTransferencia.value.salida.idSalidaTemporal,
          idComprobanteFilenet: idFilenet.value
        }
      })
      router.push({ name: 'BandejaCustodio' })
    }
  })
}
function abrirModalFirmar () {
  launchDialog({
    component: FirmarComprobante,
    width: '60%',
    header: 'Firmar Comprobante',
    confirmLabel: 'Firmar',
    cancelLabel: 'hideCancelLabel',
    confirmIcon: '',
    props: {
      data: {
        rutEntrega: '12.234.566-8',
        nombreEntrega: 'María González',
        rutRecibe: '12.345.678-9',
        nombreRecibe: 'Juan Pérez Pérez'
      }
    }
  })
}

const progress = ref(0)

const showProgress = ref(false)

function onUploader (e) {
  console.log('idEspecies', dataActaSalidaTransferencia.value)
  const especiesIds = dataActaSalidaTransferencia.value.especiesInvolucradas.filter(
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
        console.log('filenet', data)
        toastSuccess('El archivo se subió correctamente')
        idFilenet.value = data.find((e) => e.id_filenet).id_filenet
        console.log('net', idFilenet.value)
        // const idFilenetParaRegistro = idFilenet.value.find((e) => e.id_filenet)
        // console.log('fiiii', idFilenetParaRegistro.value)
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
.title {
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 1.5em;
}
.btn {
  background-color: $primary-color;
}
.boton {
  background-color: #606e84 !important;
}
::v-deep(.upload-container) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: fit-content;
  position: relative;
  .boton {
    background-color: #606e84 !important;
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
