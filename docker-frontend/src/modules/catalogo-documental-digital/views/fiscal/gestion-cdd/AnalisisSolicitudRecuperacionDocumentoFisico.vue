<template>
<LoaderSkeleton
  v-if="antecedentes.isLoading"
  height="1000px"
/>
<section v-else>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Análisis solicitud de recuperación de documento físico"
  />

  <AntecedentesSolicitante :data="antecedentesSolicitud" />

  <AntecedentesCatalogo :data="antecedentesSolicitud?.catalogo" />

  <TablaAntecedentesDocumento
    es-analizar="true"
    :rows="paginacionDocumentoSolicitud?.tamanoPagina"
    style="width: 100%"
    :total-records="paginacionDocumentoSolicitud?.elementosTotales"
    :value="documentoSolicitud"
  />

  <TipoSalida
    :data="antecedentesSolicitud?.solicitud"
    :es-revision="esRevision"
  />

  <AppBtnsSteps @back-step="handleBackStep" />
  <div>
    <div v-if="esRevision">
      <AppBtnNextTeleported
        class="btn-primary p-button-sm"
        icon="pi pi-angle-double-right"
        label="Continuar"
        @click="aprobarSolicitudRevision()"
      />
    </div>
    <div v-else>
      <AppBtnNextTeleported
        class="p-button-outlined p-button-danger mx-3"
        icon="pi pi-times"
        label="Rechazar"
        @click="openAprobarSolicitudAnalisis(2)"
      />
      <AppBtnNextTeleported
        class="btn-primary p-button"
        icon="pi pi-angle-double-right"
        label="Aprobar"
        @click="openAprobarSolicitudAnalisis(1)"
      />
    </div>
  </div>
</section>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TipoSalida from '@/modules/catalogo-documental-digital/components/revision-recuperacion-documento/TipoSalida.vue'
import AntecedentesSolicitante from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesSolicitante'
import AntecedentesCatalogo from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesCatalogo'
import TablaAntecedentesDocumento from '@/modules/catalogo-documental-digital/components/revision-almacenamiento/TablaAntecedentesDocumento'
import RechazarSolicitud from '@/modules/catalogo-documental-digital/components/analisis-solicitud-actualizacion/modal/RechazarSolicitud'
import {
  useAppDialog,
  useAppToast,
  useConfirmDialog
} from '@/modules/common/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import {
  useMantenedorCDD,
  useSolicitudesFiscalCDD
} from '@/modules/catalogo-documental-digital/composables'
import { useRoute, useRouter } from 'vue-router'
import { reactive } from '@vue/reactivity'
import { requestUtil } from '@/utils'
import { onMounted } from 'vue-demi'

const { launchConfirmDialog } = useConfirmDialog()
const { launchDialog } = useAppDialog()
const router = useRouter()
const route = useRoute()
const { toastSuccess, toastError } = useAppToast()
const {
  mantenedorCDD_getUbicacionEdificios,
  mantenedorCDD_getUbicacionBodegas,
  mantenedorCDD_getUbicacionEstantes,
  mantenedorCDD_getUbicacionCasilleros,
  mantenedorCDD_getUbicacionPasillos
} = useMantenedorCDD()

const esRevision =
  route.path ===
    '/catalogo-documental-digital/revision-recuperacion-documento' ?? true

const {
  solicitudesFiscalCDD_aprobarSolicitudRecuperacionDocuFisico,
  taskId,
  antecedentesSolicitud,
  documentoSolicitud,
  paginacionDocumentoSolicitud
} = useSolicitudesFiscalCDD()

const antecedentes = reactive({
  isLoading: false,
  firstRecord: 0,
  pagination: undefined
})

function handleBackStep () {
  router.push({ name: 'CddBandejaEncargadoBodega' })
}

function openAprobarSolicitudAnalisis (estado) {
  if (estado === 1) {
    launchConfirmDialog({
      header: `Aprobar Solicitud`,
      message: `¿Está seguro de querer Aprobar la Solicitud?`,
      acceptLabel: 'Aceptar',
      rejectClass: 'hidden',
      accept: () => {
        antecedentes.isLoading = true
        requestUtil({
          action: solicitudesFiscalCDD_aprobarSolicitudRecuperacionDocuFisico,
          payload: {
            idSolicitud: antecedentesSolicitud.value.solicitud.id,
            params: {
              estado: estado,
              taskId: taskId.value
            }
          },
          resolve: (res) => {
            toastSuccess('Análisis de Solicitud Enviado con Éxito')
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
  } else {
    launchDialog({
      component: RechazarSolicitud,
      header: 'Rechazar Solicitud',
      width: '25%',
      cancelLabel: 'Cancelar',
      confirmLabel: 'Aceptar',
      accept: (data) => {
        console.log(data)
        requestUtil({
          action: solicitudesFiscalCDD_aprobarSolicitudRecuperacionDocuFisico,
          payload: {
            idSolicitud: antecedentesSolicitud.value.solicitud.id,
            params: {
              estado: estado,
              motivoRechazo: data.motivo,
              taskId: taskId.value
            },
            resolve: (res) => {
              toastSuccess('Rechazo de Solicitud Enviado con Éxito')
              router.push({ name: 'BandejaFiscalCdd' })
            },
            reject: (r) => {
              console.log('error: ', r)
              router.push({ name: 'BandejaFiscalCdd' })
              toastError('Ocurrio un error, intente nuevamente')
            }
          }
        })
      }
    })
  }
}

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

onMounted(() => {
  requestUtil({ action: mantenedorCDD_getUbicacionEdificios })
  requestUtil({ action: mantenedorCDD_getUbicacionBodegas })
  requestUtil({ action: mantenedorCDD_getUbicacionEstantes })
  requestUtil({ action: mantenedorCDD_getUbicacionCasilleros })
  requestUtil({ action: mantenedorCDD_getUbicacionPasillos })
})
</script>
<style scoped>
.p-tooltip-text {
  text-align: center;
}
</style>
