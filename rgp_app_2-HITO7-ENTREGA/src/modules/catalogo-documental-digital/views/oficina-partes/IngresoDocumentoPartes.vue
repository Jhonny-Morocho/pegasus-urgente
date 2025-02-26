<template>
<LoaderSkeleton
  v-if="showLoader"
  height="1000px"
/>
<section
  class="mt - 4"
>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Ingreso de documento oficina de partes"
  />

  <AppFieldset
    class="p-fluid"
    legend="Antecedentes de la solicitud"
  >
    <AntecedentesSolicitud :data="antecedentesCatalogo" />

    <ArchivoDocumento :data="antecedentesDocumento" />
  </AppFieldset>

  <AyudaDocumento />

  <AppFieldset
    class="p-fluid pb-6"
    legend="Subir Archivo"
  >
    <SubirArchivo
      class="col-4"
      :relacion-front="'OficinaDePartes'"
      :tipo-relacion="'IngresarDocumento'"
      :uploaded="uploaded"
      @subir-archivo:adjuntar="adjuntar"
    />

    <div class="col-12 md:col-12 p-fluid">
      <AppTextarea
        id="observacionesArchivo"
        v-model="observaciones"
        :auto-resize="true"
        class="p-fluid col-12"
        cols="100"
        placeholder="Observaciones Oficina de Partes"
        rows="10"
      />
    </div>
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
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useSolicitudesOfDePartesCdd } from '@/modules/catalogo-documental-digital/composables/useSolicitudesOfDePartes'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AyudaDocumento from '@/modules/catalogo-documental-digital/components/ingreso-documento-partes/AyudaDocumento'
import ArchivoDocumento from '@/modules/catalogo-documental-digital/components/ingreso-documento-partes/ArchivoDocumento'
import SubirArchivo from '@/modules/global/components/documentos/SubirArchivo.vue'
import AntecedentesSolicitud from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesSolicitud'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'

const { toastSuccess, toastError } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const router = useRouter()
const showLoader = ref(false)
const uploaded = ref(false)

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

const {
  antecedentesCatalogo,
  antecedentesDocumento,
  taskId,
  solicitudesOfPartesCdd_ingresoDocumentoOfDePartes
} = useSolicitudesOfDePartesCdd()

const observaciones = ref('')
const archivo = ref()

function adjuntar (data) {
  archivo.value = data
  archivo.value.relacionFront = 'Ingreso Documento Of de partes CDD'
  uploaded.value = true
}

function enviarSolicitud () {
  console.log('ARCHIVO', archivo.value)
  console.log(antecedentesCatalogo.value)
  const payload = {
    taskid: taskId.value,
    archivo: archivo.value.fileBase64,
    mime_type: archivo.value.mimeType,
    observacionesOfPartes: observaciones.value
  }
  launchConfirmDialog({
    header: 'Agregar Documento',
    message: 'Se enviará una solicitud al fiscal',
    acceptLabel: 'Aceptar',
    rejectLabel: 'Cancelar',
    accept: () => {
      showLoader.value = true
      requestUtil({
        action: solicitudesOfPartesCdd_ingresoDocumentoOfDePartes,
        payload: {
          payload,
          idSolicitud: antecedentesCatalogo.value.idSolicitud
        },
        resolve: () => {
          showLoader.value = false
          toastSuccess('Solicitud enviada exitosamente')
          router.push({ name: 'CddBandejaOficinaPartes' })
        },
        reject: () => {
          showLoader.value = false
          toastError('Hubo un error al enviar solicitud. Intente nuevamente')
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

function handleBackStep () {
  router.push({ name: 'CddBandejaOficinaPartes' })
}

onMounted(async () => {})
</script>

<style scoped>
.resumen {
  padding: 0px 0px 0px 74px;
}
.p-tooltip-text {
  text-align: center;
}
</style>
