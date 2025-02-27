<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Registro de reingreso de documento físico"
  />

  <AppFieldset
    class="p-fluid"
    legend="Código de barras documento en devolución"
  >
    <CodigoDocumento @mostrar="mostrarFieldsets" />
  </AppFieldset>

  <AntecedentesSolicitante
    v-if="show"
    :data="solicitud"
  />

  <AntecedentesCatalogo
    v-if="show"
    :data="catalogoSolicitud"
  />
  <TablaAntecedentesDocumento
    v-if="show"
    :legend="'Antecedentes de la salida del documento físico'"
    :loading="isLoading"
    :rows="paginaciondocumento?.tamanoPagina"
    style="width: 100%"
    :total-records="paginaciondocumento?.elementosTotales"
    :value="[documentoReingreso]"
  />

  <TipoSalida
    v-if="show"
    :data="solicitud?.solicitud"
    :es-re-ingreso="true"
  />

  <RegistroDevolucion
    v-show="show"
    ref="formRegistroDevolucion"
    :data="registroDevolucion"
  />

  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnNextTeleported
    class="btn-primary p-button-sm"
    icon="pi pi-angle-double-right"
    label="Continuar"
    @click="enviarSolicitud()"
  />
</section>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import RegistroDevolucion from '@/modules/catalogo-documental-digital/components/registro-reingreso-documento/RegistroDevolucion'
import TipoSalida from '@/modules/catalogo-documental-digital/components/revision-recuperacion-documento/TipoSalida.vue'
import AntecedentesSolicitante from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesSolicitante'
import AntecedentesCatalogo from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesCatalogo'
import TablaAntecedentesDocumento from '@/modules/catalogo-documental-digital/components/analisis-solicitud-actualizacion/TablaAntecedentesDocumento'
import CodigoDocumento from '@/modules/catalogo-documental-digital/components/registro-reingreso-documento/CodigoDocumento'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { useMantenedorCDD, useSolicitudesEncargadoBodega } from '@/modules/catalogo-documental-digital/composables'

const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess } = useAppToast()
const {
  solicitud,
  documentoReingreso,
  paginaciondocumento,
  catalogoSolicitud,
  registroDevolucion,
  solicitudesEncargadoBodega_generarRegistroReingresoDocufisico
} = useSolicitudesEncargadoBodega()

const router = useRouter()

const isLoading = ref(false)
const show = ref(false)
const formRegistroDevolucion = ref(null)

function mostrarFieldsets (value) {
  formRegistroDevolucion.value?.populateData(registroDevolucion.value)
  show.value = value
}

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

function enviarSolicitud () {
  const formdata = formRegistroDevolucion.value.formData
  console.log('formdata', formdata)
  launchConfirmDialog({
    header: 'Registrar la Devolución ',
    message: '¿Está seguro de querer Registrar la Devolución del Documento?',
    acceptLabel: 'Aceptar',
    rejectClass: 'hidden',
    accept: () => {
      requestUtil({
        action: solicitudesEncargadoBodega_generarRegistroReingresoDocufisico,
        payload: {
          id: solicitud.value.recuperacionArchivo.id,
          payload: { ...formdata }
        },
        resolve: () => {
          toastSuccess(
            'Se ha registrado la devolución del documento con éxito'
          )
          router.push({ name: 'CddBandejaEncargadoBodega' })
        }
      })
    }
  })
}

function handleBackStep () {
  router.push({ name: 'CddBandejaEncargadoBodega' })
}

const {
  mantenedorCDD_getUbicacionEdificios,
  mantenedorCDD_getUbicacionBodegas,
  mantenedorCDD_getUbicacionPasillos,
  mantenedorCDD_getUbicacionEstantes,
  mantenedorCDD_getUbicacionCasilleros,
  mantenedorCDD_getFuncionarios,
  mantenedorCDD_getEstadoDocumento
} = useMantenedorCDD()

onMounted(async () => {
  await requestUtil({ action: mantenedorCDD_getUbicacionEdificios })
  await requestUtil({ action: mantenedorCDD_getUbicacionBodegas })
  await requestUtil({ action: mantenedorCDD_getUbicacionPasillos })
  await requestUtil({ action: mantenedorCDD_getUbicacionEstantes })
  await requestUtil({ action: mantenedorCDD_getUbicacionCasilleros })
  await requestUtil({ action: mantenedorCDD_getFuncionarios })
  await requestUtil({ action: mantenedorCDD_getEstadoDocumento })
})
</script>

<style scoped>
.resumen {
  padding: 0px 0px 0px 74px;
}
.p-tooltip-text {
  text-align: center;
}
</style>
