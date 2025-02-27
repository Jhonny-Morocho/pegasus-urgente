<template>
<LoaderSkeleton
  v-show="showLoader"
  height="1000px"
/>
<section v-show="!showLoader">
  <PageHeader
    class="mb-6"
    :items-menu-superior="itemsMenuSuperior"
    page-title="Revisión Solicitud de Eliminación de Documento"
  />

  <AntecedentesSolicitante
    class="w-full"
    :data="antecedentesSolicitud?.solicitante"
  />
  <AntecedentesCatalogo :data="antecedentesSolicitud?.catalogo" />

  <AppFieldset
    class="p-fluid"
    legend="Documentos o archivos contenidos en catálogo "
  >
    <div v-if="isLoading">
      <LoaderSkeleton />
    </div>
    <TablaRevisionEliminacionDocumento
      v-else
      v-model:selection="documentosSeleccionados"
      :es-revision="true"
      :loading="loading"
      :rows="antecedentesSolicitud?.archivos?.paginacion?.tamanoPagina"
      :total-records="
        antecedentesSolicitud?.archivos?.paginacion?.elementosTotales
      "
      :value="antecedentesSolicitud?.archivos?.data"
      @documentos-editados="prueba"
    />
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnNextTeleported
    class="btn-primary px-4"
    :disabled="documentos.length === 0 || hayDocumentosSinDesicion"
    icon="pi pi-angle-double-right"
    label="Continuar"
    @click="enviarRevision()"
  />
</section>
</template>

<script setup>
// COMPONENTS
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AntecedentesCatalogo from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesCatalogo'
import AntecedentesSolicitante from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesSolicitante'
import RechazarSolicitud from '@/modules/catalogo-documental-digital/components/analisis-solicitud-actualizacion/modal/RechazarSolicitud.vue'
import TablaRevisionEliminacionDocumento from '@/modules/catalogo-documental-digital/components/antecedentes-catalogo-eliminacion/TablaRevisionEliminacionDocumento.vue'

// UTILS
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/modules/common/components/PageHeader.vue'

// COMPOSABLES
import { requestUtil } from '@/utils'
import { useSolicitudesFiscalCDD } from '@/modules/catalogo-documental-digital/composables'
import { useAppDialog, useAppToast, useConfirmDialog } from '@/modules/common/composables'
const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess, toastError } = useAppToast()
const { antecedentesSolicitud, taskId, solicitudesFiscalCDD_aprobarSolicitudRevisionEliminacionArchivo } = useSolicitudesFiscalCDD()

// VALUES

// LOGIC
const router = useRouter()
const documentos = ref([])
const requestBody = ref([])
const isLoading = ref(false)
const showLoader = ref(false)
const documentosSeleccionados = ref([])

function prueba (docu, index) {
  documentos.value[index] = docu
}

function setDataSolicitudRevision () {
  console.log(documentos.value)
  documentos.value.forEach((d) => {
    const item = {
      estado: d.aprobacion,
      motivoEliminacionId: d.idMotivo,
      archivoId: d.idArchivo
    }
    requestBody.value.push(item)
  })
  console.log('params', requestBody.value)
}

const hayDocumentosSinDesicion = computed(() => {
  const hayDocumento = documentos.value?.find(
    (d) => d.aprobacion === undefined
  )
  return hayDocumento
})

const hayDocumentosRechazados = computed(() => {
  const hayDocumento = documentos.value?.find((d) => d.aprobacion === 2)
  return hayDocumento
})

function enviarRevision () {
  showLoader.value = true
  console.log(requestBody.value)
  if (hayDocumentosRechazados.value) {
    setDataSolicitudRevision()
    launchDialog({
      component: RechazarSolicitud,
      header: 'Rechazar Solicitud',
      width: '30%',
      confirmLabel: 'Rechazar',
      cancelLabel: 'Cancelar',
      accept: (data) => {
        console.log(documentos.value)
        requestUtil({
          action:
            solicitudesFiscalCDD_aprobarSolicitudRevisionEliminacionArchivo,
          payload: {
            data: {
              motivoRechazo: data.motivo,
              archivos: [...requestBody.value],
              taskId: taskId.value
            },
            id: antecedentesSolicitud.value.solicitud.id
          },
          resolve: () => {
            showLoader.value = false
            toastSuccess('Solicitud de Eliminación Rechazada con éxito')
            router.push({ name: 'BandejaFiscalCdd' })
          },
          reject: () => {
            showLoader.value = false
            toastError('Ocurrio un error, intente nuevamente')
          }
        })
      },
      reject: () => {
        showLoader.value = false
      }
    })
  } else if (!hayDocumentosRechazados.value) {
    setDataSolicitudRevision()
    launchConfirmDialog({
      header: 'Aprobar Solicitud',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      message: '¿Está seguro de querer Aprobar la Solicitud de Eliminación?',
      accept: () => {
        requestUtil({
          action:
            solicitudesFiscalCDD_aprobarSolicitudRevisionEliminacionArchivo,
          payload: {
            data: {
              archivos: [...requestBody.value],
              taskId: taskId.value
            },
            id: antecedentesSolicitud.value.solicitud.id
          },
          resolve: () => {
            showLoader.value = false
            toastSuccess('Revisión Enviada Exitosamente')
            router.push({ name: 'BandejaFiscalCdd' })
          },
          reject: () => {
            showLoader.value = false
            toastError('Ocurrió un error al enviar la solicitud')
          },
          loader: (l) => {
            isLoading.value = l
          }
        })
      },
      reject: () => {
        showLoader.value = false
      },
      onHide: () => {
        showLoader.value = false
      }
    })
  }
}

function handleBackStep () {
  router.push({ name: 'BandejaFiscalCdd' })
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
    icon: 'pi pi-replay'
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download'
  }
]
</script>

<style scoped>
.end {
  text-align: end;
}

.question {
  color: black;
  background-color: transparent;
  padding: 16px 16px 0px 0px;
}
.question:hover {
  color: black;
  background-color: transparent;
}
</style>
