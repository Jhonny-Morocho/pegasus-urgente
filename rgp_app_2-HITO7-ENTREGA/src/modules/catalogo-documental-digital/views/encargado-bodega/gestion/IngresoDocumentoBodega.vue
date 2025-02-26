<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-title="`Registro de Ingreso de Documento Físico a Bodega ${
      esBodegaTemporal ? 'Temporal' : ''
    }`"
  />

  <AppFieldset legend="Documento Digitalizado">
    <DocumentoDigitalizado
      :data="antecedentesSolicitud"
      :es-bodega-temporal="esBodegaTemporal"
    />

    <TablaAntecedentesDocumento
      class="mt-4"
      es-bodega-temporal="true"
      :legend="'Antecedentes del Documento'"
      :rows="antecedentesSolicitud?.archivo?.paginacion.tamanoPagina"
      style="width: 100%"
      :total-records="
        antecedentesSolicitud?.archivo?.paginacion.elementosTotales
      "
      :value="[antecedentesSolicitud?.archivo?.data]"
    />
  </AppFieldset>

  <AppFieldset legend="Registro de Ingreso">
    <RegistroIngreso
      ref="formDataRegistroIngreso"
      :es-bodega-temporal="esBodegaTemporal"
    />
  </AppFieldset>

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
import DocumentoDigitalizado from '@/modules/catalogo-documental-digital/components/Ingreso-documento-bodega/DocumentoDigitalizado'
import RegistroIngreso from '@/modules/catalogo-documental-digital/components/Ingreso-documento-bodega/RegistroIngreso'
import TablaAntecedentesDocumento from '@/modules/catalogo-documental-digital/components/analisis-solicitud-actualizacion/TablaAntecedentesDocumento'
import { useRoute, useRouter } from 'vue-router'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { onMounted, ref } from 'vue'
import {
  useMantenedorCDD,
  useSolicitudesEncargadoBodega
} from '@/modules/catalogo-documental-digital/composables'
import { requestUtil } from '@/utils'

const { launchConfirmDialog } = useConfirmDialog()
const router = useRouter()
const { toastSuccess, toastError } = useAppToast()
const route = useRoute()
const esBodegaTemporal = ref(false)

onMounted(async () => {
  if (route.path.includes('temporal')) {
    esBodegaTemporal.value = true
  } else esBodegaTemporal.value = false
})

const {
  taskId,
  antecedentesSolicitud,
  solicitudesEncargadoBodega_enviarRegistroDeIngresoABodega,
  solicitudesEncargadoBodega_enviarRegistroABodegaTemporal
} = useSolicitudesEncargadoBodega()
console.log(antecedentesSolicitud)
const formDataRegistroIngreso = ref({})
onMounted(async () => {
  getMantenedores()
})

const {
  mantenedorCDD_getUbicacionEdificios,
  mantenedorCDD_getUbicacionBodegas,
  mantenedorCDD_getUbicacionEstantes,
  mantenedorCDD_getUbicacionCasilleros,
  mantenedorCDD_getdestinosDocumentoFisco
} = useMantenedorCDD()

function getMantenedores () {
  requestUtil({ action: mantenedorCDD_getUbicacionEdificios })
  requestUtil({ action: mantenedorCDD_getUbicacionBodegas })
  requestUtil({ action: mantenedorCDD_getUbicacionEstantes })
  requestUtil({ action: mantenedorCDD_getUbicacionCasilleros })
  requestUtil({ action: mantenedorCDD_getdestinosDocumentoFisco })
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
  if (route.path.includes('temporal')) {
    launchConfirmDialog({
      header: 'Ingresar Documento ',
      message: '¿Está seguro de ingresar el Documento?',
      acceptLabel: 'Aceptar',
      accept: () => {
        console.log(formDataRegistroIngreso.value.formData)
        requestUtil({
          action: solicitudesEncargadoBodega_enviarRegistroABodegaTemporal,
          payload: {
            codigoBarras: formDataRegistroIngreso.value.formData.codigoBarras,
            observaciones: formDataRegistroIngreso.value.formData.observaciones,
            taskId: taskId.value,
            id: antecedentesSolicitud.value.solicitud.id
          },
          resolve: (data) => {
            console.log(data)
            toastSuccess(
              'Se ha generado el registro de ingreso a bodega temporal de forma éxitosa'
            )
            router.push({ name: 'CddBandejaEncargadoBodega' })
          },
          reject: (r) => {
            console.log('error: ', r)
            toastError('Ocurrió un error inesperado')
          }
        })
      }
    })
  } else {
    if (!formDataRegistroIngreso.value.isFormValid()) {
      toastError('Debe completar los campos requeridos.')
      return
    }
    launchConfirmDialog({
      header: 'Ingresar Documento ',
      message: '¿Está seguro de ingresar el Documento?',
      acceptLabel: 'Aceptar',
      rejectClass: 'hidden',
      accept: () => {
        requestUtil({
          action: solicitudesEncargadoBodega_enviarRegistroDeIngresoABodega,
          payload: {
            ...formDataRegistroIngreso.value.formData,
            taskId: taskId.value,
            id: antecedentesSolicitud.value.solicitud.id
          },
          resolve: (data) => {
            console.log(data)
            toastSuccess(
              'Se ha generado el registro de ingreso a bodega de forma éxitosa'
            )
            router.push({ name: 'CddBandejaEncargadoBodega' })
          },
          reject: (r) => {
            console.log('error: ', r)
            toastError('Ocurrió un error inesperado')
          }
        })
      }
    })
  }
}

function handleBackStep () {
  router.push({ name: 'CddBandejaEncargadoBodega' })
}
</script>

<style scoped>
.resumen {
  padding: 0px 0px 0px 74px;
}
</style>

<style>
.p-tooltip-text {
  text-align: center;
}
</style>
