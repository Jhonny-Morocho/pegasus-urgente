<template>
<LoaderSkeleton
  v-if="antecedentes.isLoading"
  height="1000px"
/>
<section v-else>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Revisión solicitud de recuperación de documento físico"
  />
  <AntecedentesSolicitante :data="antecedentesSolicitud" />

  <AntecedentesCatalogo :data="antecedentesSolicitud?.catalogo" />

  <TablaAntecedentesDocumento
    es-revision="true"
    :rows="antecedentesSolicitud?.archivo?.paginacion?.tamanoPagina"
    style="width: 100%"
    :total-records="
      antecedentesSolicitud?.archivo?.paginacion?.elementosTotales
    "
    :value="[antecedentesSolicitud?.archivo?.data]"
  />

  <TipoSalida
    :data="antecedentesSolicitud?.solicitud"
    :es-revision="esRevision"
  />

  <AppBtnsSteps @back-step="handleBackStep" />
  <div>
    <AppBtnNextTeleported
      class="btn-primary p-button-sm"
      icon="pi pi-angle-double-right"
      label="Continuar"
      @click="aprobarSolicitudRevision()"
    />
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

import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { useSolicitudesEncargadoBodega } from '@/modules/catalogo-documental-digital/composables'
import { useRouter } from 'vue-router'
import { reactive } from '@vue/reactivity'
import { requestUtil } from '@/utils'

const { launchConfirmDialog } = useConfirmDialog()

const router = useRouter()

const { toastSuccess, toastError } = useAppToast()

const {
  antecedentesSolicitud,
  solicitudesEncargadoBodega_enviarAnalisisSolicitudRecuperacionArchivo,
  taskId
} = useSolicitudesEncargadoBodega()

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
function aprobarSolicitudRevision () {
  const disponible = antecedentesSolicitud.value.solicitud.disponibilidad
    ? 1
    : 0
  console.log(disponible)
  launchConfirmDialog({
    header: 'Solicitud de recuperación de documento físico ',
    message: '¿Está seguro de Continuar?',
    acceptLabel: 'Aceptar',
    rejectClass: 'hidden',
    accept: () => {
      antecedentes.isLoading = true
      requestUtil({
        action:
          solicitudesEncargadoBodega_enviarAnalisisSolicitudRecuperacionArchivo,
        payload: {
          id: antecedentesSolicitud.value.solicitud.id,
          disponibilidad: disponible,
          taskId: taskId.value
        },
        resolve: () => {
          toastSuccess('Revisión de Solicitud Enviada con Éxito')
          router.push({ name: 'CddBandejaEncargadoBodega' })
        },
        reject: (r) => {
          console.log('error: ', r)
          router.push({ name: 'CddBandejaEncargadoBodega' })
          toastError('Ocurrio un error, intente nuevamente')
        }
      })
    }
  })
}

function handleBackStep () {
  router.push({ name: 'CddBandejaEncargadoBodega' })
}
</script>
<style scoped>
.p-tooltip-text {
  text-align: center;
}
</style>
