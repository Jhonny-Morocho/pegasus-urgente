<template>
<section class="col-12">
  <AppForm
    id="relato-hecho"
    :form-submitted="formSubmitted"
    validation-scope="formRelato"
  >
    <AppDropdown
      id="plantilla"
      v-model="idPlantilla"
      class="col-12 md:col-4"
      label="Seleccione Plantilla"
      option-label="labelPlantilla"
      option-value="idPlantilla"
      :options="plantillaOptions"
      show-clear
      @change="obtenerPlantilla"
    />
    <div
      v-if="isLoadingPlantilla"
      class="col-12 flex flex-column justify-content-center align-items-center"
    >
      <Skeleton
        animation="wave"
        class="col-12"
        height="300px"
      />
      <div class="cont-spinner flex flex-row justify-content-center align-items-center">
        <h3 class="mr-2">
          Generando Plantilla
        </h3>
        <ProgressSpinner
          animation-duration=".5s"
          class="spinner"
          fill="#EEEEEE"
          stroke-width="6"
        />
      </div>
    </div>
    <Editor
      v-else
      id="editor-relato-hecho"
      v-model="formData.solicitudDocFaltantes"
      class="col-12"
      editor-style="height: 256px"
      :rules="{ required }"
    />
    <div class="col-12 mt-3">
      <AppTextarea
        id="observaciones"
        v-model="formData.observaciones"
        :auto-resize="true"
        cols="100"
        label="Observaciones"
        rows="3"
        :rules="{ required }"
        style="width: 100%"
      />
    </div>
  </AppForm>

  <AppBtnNextTeleported
    class="mr-3 p-button-outlined p-button-info"
    label="Generar e Imprimir"
    no-icon
    @click="generarImprimir()"
  />

  <AppBtnNextTeleported
    label="Generar y Enviar"
    :loading="loadingGenerarEnviar"
    no-icon
    @click="generarPlantilla()"
  />
</section>
</template>

<script setup>
import { useAppGlobalProperties, useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { reactive, ref } from 'vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { requestUtil, dateTimeUtil } from '@/utils'
import { useOficinaPartesStore } from '@/modules/global/composables'
import { useRouter } from 'vue-router'

const loadingGenerarEnviar = ref(false)

const idPlantilla = ref(null)
const { launchConfirmDialog } = useConfirmDialog()
const { toastError, toastSuccess } = useAppToast()
const router = useRouter()
const { $userSub, $userFiscaliaActual, $userPrincipalRole } = useAppGlobalProperties()
const { oficinaPartes_getPropuestaPlantilla, plantilla, oficinaPartes_guardarSolicitudDocumentosFaltantes, parteSeleccionado } =
  useOficinaPartesStore()

function initialData () {
  return {
    solicitudDocFaltantes: '',
    observaciones: ''
  }
}

const formData = reactive(initialData())

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData: formData,
  validationScope: 'formRelato'
})
const isLoadingPlantilla = ref(false)
console.log(parteSeleccionado.value)

// FUNCION PARA OBTENER LA PLANTILLA
function obtenerPlantilla () {
  isLoadingPlantilla.value = true
  setTimeout(() => {
    requestUtil({
      action: oficinaPartes_getPropuestaPlantilla,
      payload:
        {
          idRelato: '2',
          ruc: '123123123',
          nombreDocumentoFaltante: 'asdasd',
          numeroOficio: 'asdasd',
          fecha: dateTimeUtil.formatToBackendWithTime()
        },
      resolve: () => {
        isLoadingPlantilla.value = false
        formData.solicitudDocFaltantes = plantilla.value
      },
      reject: (r) => {
        toastError('Ocurrio un error inesperado, intente nuevamente')
        console.log('error generarPlantilla: ', r)
      }
    })
  }, 400)
}

// FUNCION PARA GENERAR SOLICITUD Y ENVIARLA
function generarPlantilla () {
  if (!isFormValid() || !formData) {
    toastError('Debe completar Solicitud!')
    return
  }
  const usuario = {
    userSub: $userSub.value,
    region: `${$userFiscaliaActual.value.region}`,
    fiscalia: `${$userFiscaliaActual.value.fiscalia.toString()}`,
    rol: $userPrincipalRole.value
  }
  requestUtil({
    action: oficinaPartes_guardarSolicitudDocumentosFaltantes,
    payload: usuario,
    resolve: () => {
      // console.log('res de back', res)
      formSubmitted.value = false
      toastSuccess('Solcitud Enviada')
      router.push('/ingreso/solicitar-documentacion')
    },
    reject: (r) => {
      toastError('Ocurrio un error inesperado, intente nuevamente')
      console.log('error guardarRelato(editar): ', r)
    }
  })
}

function generarImprimir () {
  launchConfirmDialog({
    message: `¿Estás Seguro de Generar la Solicitud?`,
    accept: () => {
      toastSuccess('Wooosh! Se imprimió la Solicitud')
      router.push('/ingreso/solicitar-documentacion')
    }
  })
}

const plantillaOptions = [
  {
    idPlantilla: 1,
    labelPlantilla: 'Plantilla 1'
  }
]
</script>
<style scoped>
.cont-spinner {
  position: fixed;
}
.spinner {
  width: 50px;
  height: 50px;
}
</style>
