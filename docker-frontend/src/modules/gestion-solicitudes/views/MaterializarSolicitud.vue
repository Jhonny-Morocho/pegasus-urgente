<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  page-title="Materializar Solicitud Equipo Jurídico"
/>
<LoaderSkeleton v-if="loader" />
<AppForm
  v-else
  id="materializarSolicitud"
  :form-submitted="formSubmitted"
  validation-scope="materializarSolicitud"
>
  <AntecedentesSolicitud
    v-if="tipoActividad.codigo === '24'"
    :data="actividad"
  />
  <AntecedentesDiligencia
    v-if="tipoActividad.codigo === '26'"
    :data="actividad"
  />
  <ElaboracionEscrito
    :fiscal-asignado="actividad.causa.fiscalAsignado"
    :fiscalia="actividad.causa.fiscalia"
    inject-key="materializar-solicitud"
  />
  <AgregarDocumentoSolicitud />
</AppForm>
<AppFooterBtns
  label="Enviar Solicitud"
  :loading="loading"
  @back-step="handleBackStep"
  @next-step="handleEnviarSolicitud"
/>
<Dialog
  v-model:visible="isEnviando"
  modal
  :style="{ width: '35vw' }"
>
  <h3 class="mb-3 text-center">
    Enviando solicitud, esperando respuesta...
  </h3>
  <ProgressBar
    v-if="isEnviando"
    class="my-4"
    mode="indeterminate"
    style="height: 0.5em"
  />
</Dialog>
</template>
<script setup>
import { onMounted, provide, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
// components
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import ElaboracionEscrito from '@/modules/gestion-solicitudes/components/ElaboracionEscrito.vue'
import AntecedentesSolicitud from '@/modules/gestion-solicitudes/components/AntecedentesSolicitud.vue'
import AntecedentesDiligencia from '@/modules/gestion-solicitudes/components/AntecedentesDiligencia.vue'
import AgregarDocumentoSolicitud from '@/modules/gestion-solicitudes/components/AgregarDocumentoSolicitud.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import ModalComunicaciónPJUD from '@/modules/solicitudes/components/modals/ModalComunicaciónPJUD.vue'

import {
  useGestionSolicitudesStore,
  usePageHeaderOptions,
  usePamGestionSolicitudes
} from '../composables'
import {
  useAppGlobalProperties,
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil, appUtil } from '@/utils'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'

const router = useRouter()
const { toastError, TOAST_MESSAGES } = useAppToast()
const { launchDialog } = useConfirmDialog()

const { actividad, gestionSolicitudes_actualizarActividad } =
  useGestionSolicitudesStore()
const { tareaPam, pamGestionSolicitudes_materializarSolicitud } =
  usePamGestionSolicitudes()
// eslint-disable-next-line no-unused-vars
const { tipoActividad, mantenedor_getTipoActividad } = useMantenedorStore()

const {
  solicitudPJUD,
  solicitudes_getSolicitudById
} = useSolicitudesStore()

const loader = ref(false)
const isEnviando = ref(false)

const formData = reactive({
  relato: {},
  tribunal: '',
  carpetaInvestigativa: null
})

const loading = ref(false)

onMounted(() => {
  requestUtil({
    action: mantenedor_getTipoActividad,
    loader: (l) => {
      loader.value = l
    },
    payload: {
      idTipoActividad: actividad.value?.idTipoActividad
    }
  })

  if (!actividad) router.back()

  formData.tribunal = actividad.value.idUnidadDestino
})

provide('materializar-solicitud', formData)

const { formSubmitted, isFormValid } = useFormValidation({
  formData,
  validationScope: 'materializarSolicitud'
})

function handleBackStep () {
  router.push({ name: 'bandejaGestor' })
}

const { itemsMenuSuperior } = usePageHeaderOptions()
const { $userName } = useAppGlobalProperties()

async function handleEnviarSolicitud () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  } else if (!formData.relato.relato) {
    toastError('Debe ingresar un Escrito de Solicitud antes de continuar')
    return
  }

  const {
    idOrigenActividad,
    idTipoOrigenActividad,
    idTipoActividad,
    idSubtipoActividad,
    idSubSubtipoActividad,
    idUnidadOrigen,
    instruccionFiscal,
    idFiscalia
  } = actividad.value

  loading.value = true

  requestUtil({
    action: gestionSolicitudes_actualizarActividad,
    payload: {
      idActividad: actividad.value.idActividad,
      contract: {
        idOrigenActividad,
        idTipoOrigenActividad,
        idTipoActividad,
        idSubtipoActividad,
        idSubSubtipoActividad,
        idUnidadOrigen,
        idUnidadDestino: formData.fiscalia,
        instruccionFiscal,
        idFiscalia,
        idUnidadEjecutora: null,
        idResponsableMaterializar: null,
        idJustificacion: null,
        idPlantilla: null,
        textoHito: formData.relato?.relato,
        observacion: null
      }
    },
    resolve: () => {
      requestUtil({
        action: pamGestionSolicitudes_materializarSolicitud,
        payload: {
          solicitud: {
            solicitaED: false,
            solicitaContacto: false,
            userName: $userName.value
          },
          idTarea: tareaPam.value?.taskId
        },
        loader: (l) => {
          loading.value = l
        },
        resolve: async () => {
          isEnviando.value = true
          await appUtil.sleep(30000)
          requestUtil({
            action: solicitudes_getSolicitudById,
            resolve: () => {
              isEnviando.value = false

              const { observacionHito, crrInterconexion } = solicitudPJUD.value
              let title

              if (crrInterconexion) {
                title = 'Solicitud enviada'
              } else if (!crrInterconexion && observacionHito) {
                title = 'Error de conexión'
              } else {
                title = 'Solicitud Pendiente'
              }
              console.log('jh')

              launchDialog({
                component: ModalComunicaciónPJUD,
                header: title || 'no disponible',
                props: {
                  solicitudPJUD,
                  title
                },
                confirmLabel: 'Cerrar',
                cancelLabel: 'hideCancelLabel',
                closable: !crrInterconexion,
                width: '50vw',
                accept: () => {
                  router.push({ name: 'bandejaGestor' })
                }
              })
            },
            reject: () => {
              toastError('Ocurrió un error al Obtener respuesta PJUD')
            }
          })
        },
        reject: async (e) => {
          toastError(e)
        }
      })
    },
    reject: (e) => {
      loading.value = false
      toastError(e)
    }
  })
}
</script>
