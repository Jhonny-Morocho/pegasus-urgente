<template>
<PageHeader
  class="mb-5"
  :items-menu-superior="itemsMenuSuperior"
  page-title="Registrar depósito"
/>
<AppFieldset legend="Voucher de depósito">
  <TablaVoucherDeposito :dineros="dineroDeposito" />
  <div class="col-12 md:col-6">
    <p class="my-3">
      <strong>Fecha Depósito: </strong>{{ datosRegistroDeposito.data.cupon.fechaDeposito }}
    </p>
    <p class="my-3">
      <strong>Depositado por: </strong>{{ datosRegistroDeposito.data.cupon.nombreDepositante }}
    </p>
    <p class="my-3">
      <strong>RUN: </strong>{{ datosRegistroDeposito.data.cupon.runDepositante }}
    </p>
    <p class="my-3">
      <strong>Teléfono: </strong>{{ datosRegistroDeposito.data.cupon.telefono }}
    </p>
    <p class="mt-3">
      <strong>Correo: </strong>{{ voucherDepositoMock.correo }}
    </p>
  </div>
  <div class="col-12 md:col-6">
    <p class="mb-3 md:my-3">
      <strong>Total Dinero Común: </strong>{{ totalDineros(false) }}
    </p>
    <p class="my-3">
      <strong>Total Ley Drogas / Ley Lavado Dineros: </strong>{{ totalDineros(true) }}
    </p>
    <p class="my-3">
      <strong>Total General: </strong>{{ totalDineros(false) + totalDineros(true) }}
    </p>
    <div class="col-6">
      <div class="col-12 md:col-6 text-center w-full">
        <LoaderSkeleton v-if="isLoading" />
        <img
          v-else
          alt="imagen QR"
          class="w-8 md:w-6 lg:w-12 m-auto w-full"
          :src="`${dataCodigoBarra}`"
          style="border-style: solid; border-radius: 8px;  height: 10vh"
        >
      </div>
    </div>
  </div>
</AppFieldset>
<AppFieldset
  class="col-12"
  legend="Registrar depósito"
>
  <AppForm
    :id="'formRegistrarCupon'"
    class="col-12 grid"
    :form-submitted="formSubmitted"
    :validation-scope="'formRegistrarCupon'"
  >
    <AppCalendar
      id="fechaHoraDeposito"
      v-model="formData.fechaHoraDeposito"
      class="col-12 md:col-6 lg:col-4"
      date-format="dd-mm-yy"
      label="Fecha/Hora de Depósito"
      month-navigator
      :rules="{ required }"
      show-time
      year-navigator
      year-range="1921:2030"
    />
    <AppInput
      id="numeroComprobante"
      v-model="formData.numeroComprobante"
      class="col-12 md:col-6 lg:col-4"
      label="Número de comprobante"
      :rules="{ required }"
    />
  </AppForm>
  <div class="col-12">
    <h3 class="mb-2">
      Cargar comprobante:
    </h3>
    <div class="upload-container">
      <FileUpload
        accept="image/*,application/pdf"
        cancel-icon="pi pi-times"
        choose-label="Seleccionar Archivo"
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
</AppFieldset>
<AppFooterBtns
  label="Registrar Depósito"
  @back-step="handleBackStep"
  @next-step="openModalRegistroDeposito()"
/>
</template>

<script setup>
import { reactive, ref } from 'vue'
import {
  useGenerarCuponDeDeposito,
  useItemsMenuSuperiorCadena,
  useSalidaDinero,
  useSubirArchivosStore
} from '../../composables'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import { useRouter } from 'vue-router'
import TablaVoucherDeposito from '@/modules/recepcion-especies-dinero/components/registrar-deposito/TablaVoucherDeposito.vue'
import { requestUtil } from '@/utils'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)
const { launchConfirmDialog } = useConfirmDialog()
const { datosRegistroDeposito } = useSalidaDinero()
const router = useRouter()
const {
  generarCuponDeDeposito_generarCodigoDeBarra
} = useGenerarCuponDeDeposito()

const formData = reactive({
  fechaHoraDeposito: '',
  numeroComprobante: ''
})

const { required, isFormValid, formSubmitted } = useFormValidation({
  formData,
  validationScope: 'formRegistrarCupon'
})

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}

const progress = ref(0)

const showProgress = ref(false)

const { subirArchivosStore_subirArchivo } = useSubirArchivosStore()

const { toastError, TOAST_MESSAGES, toastSuccess } = useAppToast()

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
        especies: [datosRegistroDeposito.value.data.especie.idEspecie],
        contenido: base64,
        extensionArchivo: file.type.split('/').pop(),
        titulo: file.name,
        descripcion: file.name,
        procedencia: 'Registrar Depósito',
        metadata: [
          {
            RUC: datosRegistroDeposito.value.data.ruc
          }
        ]
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
const dataCodigoBarra = ref()
function generarCodigo () {
  requestUtil({
    action: generarCuponDeDeposito_generarCodigoDeBarra,
    payload: {
      ruc: datosRegistroDeposito.value.data?.ruc,
      rue: datosRegistroDeposito.value.data?.especie?.rue,
      monto: `'${datosRegistroDeposito.value.data.especie?.monto}'`
    },
    resolve: (res) => {
      dataCodigoBarra.value = res.data.dataUrl
    }
  })
}
// LA FUNCIÓN NO ESPERA ARGUMENTOS generarCodigo(datosRegistroDeposito.value.data)
generarCodigo()

function openModalRegistroDeposito () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  launchConfirmDialog({
    header: 'Registrar Depósito',
    message: '¿Está seguro de Registrar el Depósito?',
    acceptLabel: 'Salir',
    accept: () => {
      router.push({ name: 'BandejaCustodio' })
    }
  })
}

function handleBackStep () {
  router.push({ name: 'BandejaCustodio' })
}

const dineroDeposito = ref([datosRegistroDeposito.value.data])
const voucherDepositoMock = {
  fechaDeposito: '31-08-2022',
  depositadoPor: 'María González',
  run: '12.345.678-9',
  telefono: '+5693457688',
  correo: 'maria.gonzalez@minpublico.cl',
  dineros: [
    {
      id: '8904954',
      nue: '1939406',
      rue: '00077798-1',
      ruc: '2207897771-5',
      fiscaliaRegional: 'La Fiscalía Regional ',
      fiscaliaLocal: 'La Fiscalía Local ',
      numeroConvenio: '10609195',
      monto: 20000,
      cuentaDeposito: '00009005153',
      leyDrogasLavadoDinero: true
    },
    {
      id: '9145360',
      nue: '3711921',
      rue: '00022269-1',
      ruc: '2207897771-5',
      fiscaliaRegional: 'La Fiscalía Regional ',
      fiscaliaLocal: 'La Fiscalía Local ',
      numeroConvenio: '10609195',
      monto: 15000,
      cuentaDeposito: '00009005153',
      leyDrogasLavadoDinero: false
    }
  ]
}

function totalDineros (v) {
  let total = 0
  voucherDepositoMock.dineros.forEach((d) => {
    if (v === d.leyDrogasLavadoDinero) {
      total += d.monto
    }
  })
  return total
}
</script>
<style lang="scss" scoped>
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
