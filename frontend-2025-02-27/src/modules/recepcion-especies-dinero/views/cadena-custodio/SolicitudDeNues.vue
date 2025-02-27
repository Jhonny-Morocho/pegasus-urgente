<template>
<PageHeader
  class="mb-5"
  :items-menu-superior="itemsMenuSuperior"
  page-title="Solicitud de Nue's"
/>
<DatosSolicitanteNue ref="datosSolicitudNue" />
<HistorialDeSolicitudDeNues
  :rows="paginacion?.tamanoPagina"
  :toggleable="true"
  :total-records="paginacion?.elementosTotales"
  :value="historialSolicitudNues"
  @page="getData"
/>
<SolicitudNue ref="solicitudNue" />
<AppFooterBtns
  :button-next-disabled="!solicitudNue?.formData.cantidadNue"
  label="Solicitar Nue"
  @back-step="handleBackStep"
  @next-step="openModalConfirmarSolicitud()"
/>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

// components
import SolicitudNue from '../../components/solicitud-de-nue/SolicitudNue.vue'
import DatosSolicitanteNue from '../../components/solicitud-de-nue/DatosSolicitanteNue.vue'
import ModalConfirmacionSolicitudNue from '@/modules/recepcion-especies-dinero/components/solicitud-de-nue/modals/ModalConfirmacionSolicitudNue.vue'
import HistorialDeSolicitudDeNues from '../../components/solicitud-de-nue/HistorialDeSolicitudDeNues.vue'
import ModalSolicitudExitosa from '@/modules/recepcion-especies-dinero/components/solicitud-de-nue/modals/ModalSolicitudExitosa.vue'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'

// composables
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { useItemsMenuSuperiorCadena, useSolicitudAsignacionNue } from '../../composables'

// utils
import { requestUtil } from '@/utils'

const router = useRouter()

onMounted(() => {
  getHistorialSolicitudNues()
})

const solicitudNue = ref(null)
const datosSolicitudNue = ref(null)

const {
  solicitudAsignacionNue_addSolicitudAsignacionNue,
  solicitudAsignacionNue_getHistorialSolicitudNues,
  historialSolicitudNues
} = useSolicitudAsignacionNue()

const solicitudes = reactive({
  isLoading: false,
  firstRecord: 0
})

function getData (pagination = undefined) {
  if (!pagination) {
    solicitudes.firstRecord = 0
  }
  requestUtil({
    action: solicitudAsignacionNue_getHistorialSolicitudNues,
    payload: {
      idOrganismo: '41c4b4ff-c0fe-4f54-b2bf-57b754296ffb',
      page: pagination?.page || 0,
      size: pagination?.rows || 10
    },
    loader: (v) => {
      solicitudes.isLoading = v
    }
  })
}

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)

const { toastError, TOAST_MESSAGES } = useAppToast()
const { launchDialog } = useAppDialog()

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}
function getHistorialSolicitudNues () {
  requestUtil({
    action: solicitudAsignacionNue_getHistorialSolicitudNues,
    payload: {
      idOrganismo: '41c4b4ff-c0fe-4f54-b2bf-57b754296ffb'
    }
  })
}

function handleBackStep () {
  router.push({ name: 'BandejaCustodio' })
}

function openModalConfirmarSolicitud () {
  if (!solicitudNue.value.isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  const { cantidadNue, observacion, fecha } = solicitudNue.value.formData

  launchDialog({
    component: ModalConfirmacionSolicitudNue,
    header: 'Confirmar Solicitud de NUE',
    width: '30%',
    props: {
      cantidad: cantidadNue,
      fecha: fecha,
      observaciones: observacion
    },
    confirmLabel: 'Confirmar',
    accept: () => {
      requestUtil({
        action: solicitudAsignacionNue_addSolicitudAsignacionNue,
        payload: {
          idFuncionario: 'acb057d2-19fe-4d41-a437-58622cb91254',
          idOrganismo: '41c4b4ff-c0fe-4f54-b2bf-57b754296ffb',
          cantidad: cantidadNue,
          observaciones: observacion
        },
        resolve: (data) => {
          getHistorialSolicitudNues()
          const dataModal = data.nueAsignada
          console.log('DATAmodal', dataModal)
          launchDialog({
            component: ModalSolicitudExitosa,
            header: 'Solicitud exitosa',
            props: { data: dataModal },
            cancelLabel: 'Cerrar',
            accept: () => {
              solicitudNue.value.isFormValid()
            }
          })
        }
      })
      solicitudNue.value.resetFormData()
    }

  })
}
</script>
