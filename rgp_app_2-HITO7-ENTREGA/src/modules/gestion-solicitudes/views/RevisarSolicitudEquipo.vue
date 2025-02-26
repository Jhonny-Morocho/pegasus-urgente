<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  page-subtitle="Nombre Causa: Algun delito..."
  page-title="Revisar Solicitud Equipo Juridico"
/>

<AppBtnsSteps
  :no-button-back="cantContinue"
  @back-step="handleBackStep"
/>

<AppBtnRightTeleported>
  <Button
    class="p-button-outlined px-5"
    icon="pi pi-arrow-left"
    icon-pos="left"
    label="Volver a Ingresar Datos"
    @click="handleEnviarSolicitud"
  />
</AppBtnRightTeleported>
<AppBtnNextTeleported
  label="Registrar Ingreso"
  @click="handleEnviarSolicitud"
/>
</template>
<script setup>
import { reactive, provide, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'

import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
// import AntecedentesSolicitud from '@/modules/gestion-solicitudes/components/AntecedentesSolicitud.vue'
// import AgregarDocumentoSolicitud from '@/modules/gestion-solicitudes/components/AgregarDocumentoSolicitud.vue'
// import ElaboracionEscrito from '@/modules/gestion-solicitudes/components/ElaboracionEscrito.vue'
import { requestUtil } from '@/utils'
import { usePageHeaderOptions } from '../composables'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables/useGestionSolicitudesStore'

const { itemsMenuSuperior } = usePageHeaderOptions()
const { toastError, TOAST_MESSAGES } = useAppToast()

// eslint-disable-next-line no-unused-vars
const router = useRouter()
const {
  // antecedentesSolicitud,
  idDenuncia,
  gestionSolicitudes_getAntecedentes
} = useGestionSolicitudesStore()

const formData = reactive({
  relato: {},
  fiscalias: '',
  carpetaInvestigativa: null
})

provide('materializar-solicitud', formData)

const { isFormValid } = useFormValidation({
  formData,
  validationScope: 'materializarSolicitud'
})

function getAntecedentes () {
  requestUtil({
    action: gestionSolicitudes_getAntecedentes,
    payload: {
      idDenuncia: idDenuncia.value
    }
  })
}

// eslint-disable-next-line no-unused-vars
function handleEnviarSolicitud () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
  } else if (!formData.relato.relato) {
    toastError('Debe ingresar un Escrito de Solicitud antes de continuar')
  }
}

onMounted(() => {
  getAntecedentes()
})
</script>
