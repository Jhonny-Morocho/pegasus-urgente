<template>
<LoaderSkeleton
  v-if="isLoading"
  height="1000px"
/>
<section v-else>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Registro de Salida de Documento Físico"
  />

  <AntecedentesSolicitante :data="antecedentesSolicitud" />

  <AntecedentesCatalogo :data="antecedentesSolicitud.catalogo" />

  <TablaAntecedentesDocumento
    es-registro-salida="true"
    :rows="antecedentesSolicitud?.archivo?.paginacion?.tamanoPagina"
    style="width: 100%"
    :total-records="
      antecedentesSolicitud?.archivo?.paginacion.elementosTotales
    "
    :value="[antecedentesSolicitud?.archivo?.data]"
  />

  <TipoSalida :data="antecedentesSolicitud?.solicitud" />

  <RegistroSalida
    ref="refregistroDeSalida"
    :is-loading="isLoading"
    :tipo-salida="antecedentesSolicitud?.solicitud.tipoDeSalidaId"
  />

  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnNextTeleported
    class="btn-primary p-button-sm"
    icon="pi pi-angle-double-right"
    label="Registrar Salida"
    :loading="isLoading"
    @click="generarRegistroDeSalida()"
  />
</section>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import { useRouter } from 'vue-router'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TipoSalida from '@/modules/catalogo-documental-digital/components/revision-recuperacion-documento/TipoSalida.vue'
import AntecedentesSolicitante from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesSolicitante'
import AntecedentesCatalogo from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesCatalogo'
import RegistroSalida from '@/modules/catalogo-documental-digital/components/registro-salida/RegistroSalida'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import TablaAntecedentesDocumento from '@/modules/catalogo-documental-digital/components/revision-almacenamiento/TablaAntecedentesDocumento'

import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import {
  useMantenedorCDD,
  useSolicitudesEncargadoBodega
} from '@/modules/catalogo-documental-digital/composables'
import { onMounted, ref } from 'vue-demi'
import { requestUtil, dateTimeUtil } from '@/utils'
const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()
const router = useRouter()
const refregistroDeSalida = ref(null)
const {
  antecedentesSolicitud,
  taskId,
  solicitudesEncargadoBodega_generarRegistroDesalidaDocufisico
} = useSolicitudesEncargadoBodega()
const { mantenedorCDD_getFuncionarios } = useMantenedorCDD()

onMounted(async () => {
  await requestUtil({ action: mantenedorCDD_getFuncionarios })
})
const isLoading = ref(false)

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

function generarRegistroDeSalida () {
  if (!refregistroDeSalida.value.isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  const ref = refregistroDeSalida.value.formData
  const payload = {
    aQuienSeLeEntrega: ref.entrega,
    aQuienSeLeEntregaIdentificador: ref.funcionario,
    fechaEntrega: dateTimeUtil.formatToBackend(ref.fechaEntrega),
    plazo: ref.plazo,
    fechaDevolucion: dateTimeUtil.formatToBackend(ref.fechaDevolucion),
    observaciones: ref.observaciones,
    taskId: taskId.value,
    id: antecedentesSolicitud.value.solicitud.id
  }
  launchConfirmDialog({
    header: 'Registrar Salida',
    message: '¿Está seguro de querer Registrar la Salida?',
    acceptLabel: 'Aceptar',
    rejectClass: 'hidden',
    accept: async () => {
      isLoading.value = true
      requestUtil({
        action: solicitudesEncargadoBodega_generarRegistroDesalidaDocufisico,
        payload: {
          ...payload
        },
        resolve: async () => {
          isLoading.value = false
          toastSuccess('Registro de Salida Creado con Éxito')
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
.resumen {
  padding: 0px 0px 0px 74px;
}
.p-tooltip-text {
  text-align: center;
}
</style>
