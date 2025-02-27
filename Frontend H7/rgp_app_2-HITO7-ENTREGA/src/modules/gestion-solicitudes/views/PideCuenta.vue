<template>
<section class="mt-4">
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-subtitle="RUC 2200938215-8 "
    page-title="Pide Cuenta"
  />
  <AppForm
    :form-submitted="formSubmitted"
    validation-scope="pideCuenta"
  >
    <AntecedentesSolicitud
      class="my-6"
      :data="antecedentesSolicitud"
      hide-instrucciones-fiscal
      ver-solicitud
    />
    <PideCuenta
      button-label="Ver Mensaje"
      :data="pideCuentaAutomatico"
      title="Pide Cuenta Automático"
    />
    <NuevoPideCuenta
      v-model="formData"
      class="my-6"
    />
    <ElaborarEscritoSolicitudPideCuenta
      v-model="formData"
      @get-plantilla-pide-cuenta="getPlantillaPideCuenta"
    />
  </AppForm>
</section>

<AppFooterBtns
  label="Enviar Pide Cuenta"
  @back-step="handleBackStep"
  @next-step="handleEnviar"
/>
</template>
<script setup>
// components
import AntecedentesSolicitud from '@/modules/gestion-solicitudes/components/AntecedentesSolicitud.vue'
import NuevoPideCuenta from '@/modules/gestion-solicitudes/components/NuevoPideCuenta.vue'
import ElaborarEscritoSolicitudPideCuenta from '@/modules/gestion-solicitudes/components/ElaborarEscritoSolicitudPideCuenta.vue'
import PideCuenta from '@/modules/gestion-solicitudes/components/PideCuenta.vue'
import { usePageHeaderOptions } from '../composables'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useRouter } from 'vue-router'
import { reactive, onMounted } from 'vue'
import { requestUtil } from '@/utils'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables/useGestionSolicitudesStore'

const { itemsMenuSuperior } = usePageHeaderOptions()
const router = useRouter()
const { launchConfirmDialog } = useConfirmDialog()
const { toastError, TOAST_MESSAGES } = useAppToast()

const {
  antecedentesSolicitud,
  pideCuentaAutomatico,
  idDenuncia,
  gestionSolicitudes_getAntecedentes,
  gestionSolicitudes_getPideCuentaAutomatico,
  gestionSolicitudes_postElaborarEscritoPideCuenta,
  gestionSolicitudes_getPlantillaPideCuenta
} = useGestionSolicitudesStore()

const formData = reactive({
  nuevoPlazo: '',
  informarFiscalJefe: null,
  idPlantillaPideCuenta: '',
  editorPideCuenta: ''
})

const { isFormValid, formSubmitted } =
  useFormValidation({
    formData
  })

function getAntecedentes () {
  requestUtil({
    action: gestionSolicitudes_getAntecedentes,
    payload: {
      idDenuncia: idDenuncia.value
    }
  })
}

function getPideCuentaAutomatico () {
  requestUtil({
    action: gestionSolicitudes_getPideCuentaAutomatico,
    payload: {
      idDenuncia: idDenuncia.value
    }
  })
}

function getPlantillaPideCuenta () {
  requestUtil({
    action: gestionSolicitudes_getPlantillaPideCuenta,
    payload: {
      idPlantillaPideCuenta: formData.idPlantillaPideCuenta,
      editorPideCuenta: formData.editorPideCuenta
    },
    resolve: (data) => {
      formData.editorPideCuenta = data?.texto
    }
  })
}

function handleBackStep () {
  router.push({ name: 'BandejaFiscalGestion' })
}

function handleEnviar () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  } else if (!formData.editorPideCuenta) {
    toastError('Debe ingresar un Escrito de Solicitud antes de continuar')
    return
  }

  launchConfirmDialog({
    header: 'Enviar Pide Cuenta ',
    message: `¿Está seguro de Enviar Pide Cuenta?`,
    accept: () => {
      requestUtil({
        action: gestionSolicitudes_postElaborarEscritoPideCuenta,
        payload: {
          idDenuncia: idDenuncia.value,
          formData
        }
      })
      router.push({ name: 'BandejaFiscalGestion' })
    }
  })
}

onMounted(() => {
  getAntecedentes()
  getPideCuentaAutomatico()
})
</script>
