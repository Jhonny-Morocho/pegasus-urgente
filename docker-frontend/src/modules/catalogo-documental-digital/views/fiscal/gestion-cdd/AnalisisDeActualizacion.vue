<template>
<LoaderSkeleton
  v-if="antecedentes.isLoading"
  height="1000px"
/>

<section
  v-else
  class="mt-6"
>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Análisis de solicitud de actualización"
  />

  <AppFieldset
    class="p-fluid"
    legend="Antecedentes de la solicitud"
  >
    <AntecedentesSolicitud :data="antecedentesSolicitud" />
  </AppFieldset>

  <TablaAntecedentesDocumento
    :es-analisis="true"
    :legend="'Antecedentes del Documento'"
    :rows="paginacionDocumentoSolicitud?.tamanoPagina"
    style="width: 100%"
    :total-records="paginacionDocumentoSolicitud?.elementosTotales"
    :value="documentoSolicitud"
  />

  <AppFieldset
    class="p-fluid mb-8"
    legend="Datos Actualizados"
  >
    <div class="col-12 grid">
      <div class="col-6">
        <h2 class="py-4">
          Datos originales
        </h2>
        <MostrarDatos
          :data="antecedentesSolicitud?.archivo?.data"
          :es-datos-originales="true"
        />
      </div>
      <div class="col-6">
        <h2 class="py-4">
          Datos a actualizar
        </h2>
        <MostrarDatos :data="antecedentesSolicitud?.solicitud" />
      </div>
    </div>
  </AppFieldset>
  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnRightTeleported>
    <Button
      class="p-button-outlined p-button-danger mx-3 px-5"
      icon="pi pi-times"
      icon-pos="right"
      label="Rechazar"
      @click="openRechazarSolicitud"
    />
    <Button
      class="btn-primary px-5"
      icon="pi pi-check"
      icon-pos="right"
      label="Aprobar"
      @click="openAprobarSolicitud"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import TablaAntecedentesDocumento from '@/modules/catalogo-documental-digital/components/analisis-solicitud-actualizacion/TablaAntecedentesDocumento.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import RechazarSolicitud from '@/modules/catalogo-documental-digital/components/analisis-solicitud-actualizacion/modal/RechazarSolicitud.vue'
import MostrarDatos from '@/modules/catalogo-documental-digital/components/analisis-solicitud-actualizacion/MostrarDatos.vue'
import AntecedentesSolicitud from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesSolicitud'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import {
  useAppDialog,
  useConfirmDialog,
  useAppToast
} from '@/modules/common/composables'
import { useSolicitudesFiscalCDD } from '@/modules/catalogo-documental-digital/composables'

const router = useRouter()
const { toastSuccess, toastError } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const { launchDialog } = useAppDialog()

const {
  solicitudesFiscalCDD_aprobarSolicitudActualizacion,
  documentoSolicitud,
  paginacionDocumentoSolicitud,
  antecedentesSolicitud,
  taskId
} = useSolicitudesFiscalCDD()

const antecedentes = reactive({
  isLoading: false,
  firstRecord: 0,
  pagination: undefined
})

const itemsMenuSuperior = [
  {
    label: 'Causa',
    icon: 'pi pi-plus-circle'
  },
  {
    label: 'CDD',
    icon: 'pi pi-plus-circle'
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-refresh'
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download'
  }
]

function handleBackStep () {
  router.push({ name: 'BandejaFiscalCdd' })
}

function openAprobarSolicitud () {
  launchConfirmDialog({
    header: 'Confirmación',
    message: '¿Está seguro de aprobar la Solicitud?',
    acceptLabel: 'Aprobar',
    rejectClass: 'hidden',
    accept: () => {
      antecedentes.isLoading = true
      requestUtil({
        action: solicitudesFiscalCDD_aprobarSolicitudActualizacion,
        payload: {
          id: antecedentesSolicitud.value.solicitud.id,
          params: {
            type: 1,
            taskId: taskId.value
          }
        },
        resolve: () => {
          launchConfirmDialog({
            header: 'Solicitud Aprobada',
            message: 'La decisión de Aprobar ha sido registrada con éxito',
            rejectClass: 'hidden',
            accept: () => {
              antecedentes.isLoading = false
              toastSuccess('Solicitud de Actualización Aprobada con éxito')
              router.push({ name: 'BandejaFiscalCdd' })
            }
          })
        },
        reject: (r) => {
          console.log('error: ', r)
          router.push({ name: 'BandejaFiscalCdd' })
          toastError('Ocurrio un error, intente nuevamente')
        }
      })
    }
  })
}

function openRechazarSolicitud () {
  launchDialog({
    component: RechazarSolicitud,
    header: 'Rechazar Solicitud',
    width: '30%',
    cancelLabel: 'Cancelar',
    confirmLabel: 'Rechazar',
    accept: (data) => {
      requestUtil({
        action: solicitudesFiscalCDD_aprobarSolicitudActualizacion,
        payload: {
          id: antecedentesSolicitud.value.solicitud.id,
          params: {
            type: 2,
            motivoRechazo: data?.motivo,
            taskId: taskId.value
          }
        },
        resolve: () => {
          toastSuccess('Solicitud de Actualización Rechazada con éxito')
          router.push({ name: 'BandejaFiscalCdd' })
        },
        reject: (r) => {
          console.log('error: ', r)
          router.push({ name: 'BandejaFiscalCdd' })
          toastError('Ocurrio un error, intente nuevamente')
        }
      })
    }
  })
}
</script>
