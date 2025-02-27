<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Revisión de solicitud de almacenamiento físico"
  />
</section>
<AppFieldset
  class="p-fluid"
  legend="Antecedentes de la solicitud"
>
  <AntecedentesSolicitud :data="antecedentesSolicitud" />
</AppFieldset>

<TablaAntecedentesDocumento
  :legend="'Antecedentes del Documento'"
  :loading="antecedentes?.isLoading"
  :rows="paginacionDocumentoSolicitud?.tamanoPagina"
  style="width: 100%"
  :total-records="paginacionDocumentoSolicitud?.elementosTotales"
  :value="documentoSolicitud"
/>

<AppBtnsSteps @back-step="handleBackStep" />
<AppBtnNextTeleported
  class="p-button-outlined p-button-danger mx-3"
  icon="pi pi-times"
  label="Rechazar"
  :loading="isLoading"
  @click="decisionSolicitud(2)"
/>
<AppBtnNextTeleported
  class="btn-primary"
  icon="pi pi-check"
  label="Aprobar"
  :loading="isLoading"
  @click="decisionSolicitud(1)"
/>
</template>

<script setup>
// COMPONENTS
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AntecedentesSolicitud from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesSolicitud'
import MarcarEvidencia from '@/modules/catalogo-documental-digital/components/revision-almacenamiento/modal/MarcarEvidencia.vue'
import RechazarSolicitud from '@/modules/catalogo-documental-digital/components/revision-almacenamiento/modal/RechazarSolicitud.vue'
import TablaAntecedentesDocumento from '@/modules/catalogo-documental-digital/components/analisis-solicitud-actualizacion/TablaAntecedentesDocumento'

// UTILS
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'

// COMPOSABLES
import { requestUtil } from '@/utils'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { useMantenedorCDD, useSolicitudesFiscalCDD } from '@/modules/catalogo-documental-digital/composables'

const router = useRouter()
const { launchDialog } = useAppDialog()
const { toastError, toastSuccess } = useAppToast()
const { mantenedorCDD_getdestinosDocumentoFisco } = useMantenedorCDD()
const { taskId, antecedentesSolicitud, documentoSolicitud, paginacionDocumentoSolicitud, solicitudesFiscalCDD_aprueboRechazoSolicitudAlmacenamientoFisico } = useSolicitudesFiscalCDD()

// VALUES
const isLoading = ref(false)
const itemsMenuSuperior = [
  {
    label: 'Actualizar',
    icon: 'pi pi-refresh'
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download'
  }
]

// LOGIC
onMounted(() => {
  requestUtil({
    action: mantenedorCDD_getdestinosDocumentoFisco
  })
})

function decisionSolicitud (value) {
  const desicion = value
  if (desicion === 2) {
    launchDialog({
      component: RechazarSolicitud,
      header: 'Rechazar Solicitud',
      width: '40%',
      confirmLabel: 'Aceptar',
      accept: (formData) => {
        isLoading.value = true
        requestUtil({
          action:
            solicitudesFiscalCDD_aprueboRechazoSolicitudAlmacenamientoFisico,
          payload: {
            ...formData,
            taskId: taskId.value,
            idSolicitud: antecedentesSolicitud.value.idSolicitud,
            estado: 2
          },
          resolve: () => {
            isLoading.value = false
            toastSuccess('Se rechazo la solicitud con éxito.')
            router.push({ name: 'BandejaFiscalCdd' })
          },
          error: () => {
            toastError('error')
          }
        })
      }
    })
  } else {
    launchDialog({
      component: MarcarEvidencia,
      header: 'Marcar Documento como evidencia',
      width: '25%',
      confirmLabel: 'Aceptar',
      accept: (formData) => {
        isLoading.value = true
        requestUtil({
          action:
            solicitudesFiscalCDD_aprueboRechazoSolicitudAlmacenamientoFisico,
          payload: {
            ...formData,
            taskId: taskId.value,
            idSolicitud: antecedentesSolicitud.value.idSolicitud,
            estado: 1
          },
          resolve: () => {
            isLoading.value = false
            toastSuccess('Se aprobó la solicitud con éxito.')
            router.push({ name: 'BandejaFiscalCdd' })
          }
        })
      }
    })
  }
}

function handleBackStep () {
  router.push({ name: 'BandejaFiscalCdd' })
}
</script>
