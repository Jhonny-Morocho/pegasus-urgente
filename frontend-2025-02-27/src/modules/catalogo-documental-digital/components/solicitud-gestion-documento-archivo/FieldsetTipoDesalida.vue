<template>
<AppForm
  id="ingresoDocumento"
  class="col-12"
  :form-submitted="formSubmitted"
  validation-scope="formRecuperacionDocumentofisico"
>
  <div class="col-12 md:col-12 p-fluid">
    <div class="grid formgrid">
      <div class="col-4">
        <AppDropdown
          id="idioma"
          v-model="formData.tipoDeSalida"
          label="Tipo de salida"
          option-label="descripcion"
          option-value="id"
          :options="salidas"
          :rules="{ required }"
          show-clear
        />
      </div>
      <div class="col-4">
        <AppInputNumber
          id="cantidadPaginas"
          v-model="formData.plazoDeConsulta"
          :disabled="!formData.tipoDeSalida"
          label="Dias plazo para consulta"
          :min="0"
          :rules="{ required }"
          show-buttons
        />
      </div>
    </div>
  </div>
  <div class="grid formgrid py-3">
    <div class="col-12 mb-2 lg:col-12 lg:mb-0">
      <div class="col-12 md:col-12 p-fluid">
        <AppTextarea
          id="descripcionArchivo"
          v-model="formData.observaciones"
          :auto-resize="true"
          class="p-fluid col-12"
          placeholder="Observaciones de la Solicitud"
          rows="15"
        />
      </div>
    </div>
  </div>
  <div class="col-12 flex align-items-center justify-content-end px-3">
    <div clas="flex flex-column field p-fluid col-12">
      <AppBtnRightTeleported>
        <Button
          class="col-3 btn-primary px-5 mr-5"
          icon="pi pi-send"
          icon-pos="right"
          label="Enviar Solicitud"
          :loading="isLoading"
          @click="enviarSolicitud"
        />
      </AppBtnRightTeleported>
    </div>
  </div>
</AppForm>
</template>

<script setup>
import { reactive, ref, defineProps, onMounted, defineEmits } from 'vue'
import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import { useMantenedorCDD, useSolicitudesFiscalCDD } from '../../composables'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useSessionStore } from '@/modules/session/composables'
import { useRouter } from 'vue-router'

const { toastError, toastSuccess, TOAST_MESSAGES } = useAppToast()
const { user } = useSessionStore()
const { launchConfirmDialog } = useConfirmDialog()
const { solicitudesFiscalCDD_solicitudRecuperacionDocumentoFisico } =
  useSolicitudesFiscalCDD()
const { salidas, mantenedorCDD_getTiposSalidas } = useMantenedorCDD()
const isLoading = ref(false)
const router = useRouter()
const emit = defineEmits(['setLoader'])
const props = defineProps({
  dataDoc: propTypes.array
})
const formData = reactive({
  tipoDeSalida: '',
  plazoDeConsulta: null,
  observaciones: ''
})

onMounted(() => {
  requestUtil({ action: mantenedorCDD_getTiposSalidas })
  console.log(salidas.value)
})

const { formSubmitted, required, isFormValid, resetFormData } =
  useFormValidation({
    formData,
    validationScope: 'formRecuperacionDocumentofisico'
  })

function enviarSolicitud () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  const payload = {
    id_solicitante: user.value.sub,
    id_tipo_salida: formData.tipoDeSalida,
    plazo_dias: formData.plazoDeConsulta,
    observaciones: formData.observaciones,
    id_filenet: props.dataDoc.idFilenet
  }
  console.log(payload)
  launchConfirmDialog({
    header: 'Enviar Solicitud ',
    acceptLabel: 'Aceptar',
    message: '¿Estás seguro de querer enviar la Solicitud?',
    acceptIcon: '',
    accept: () => {
      emit('setLoader', true)
      requestUtil({
        action: solicitudesFiscalCDD_solicitudRecuperacionDocumentoFisico,
        payload: payload,
        resolve: () => {
          emit('setLoader', false)
          resetFormData()
          toastSuccess('La solicitud ha sido enviada con éxito')
          router.push({ name: 'BandejaFiscalCdd' })
        },
        loader: (l) => (isLoading.value = l),
        reject: () => {
          emit('setLoader', false)
          toastError('Ha ocurrido un error al enviar la solicitud')
        }
      })
    },
    reject: () => {
      emit('setLoader', false)
    },
    onHide: () => {
      emit('setLoader', false)
    }
  })
}
</script>
