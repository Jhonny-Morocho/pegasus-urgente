<template>
<LoaderSkeleton
  v-show="showLoader"
  height="1000px"
/>
<section v-show="!showLoader">
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Agendamiento de devolución de documento"
  />

  <AntecedentesSolicitante :data="antecedentesSolicitud" />

  <AntecedentesCatalogo :data="catalogoSolicitud" />

  <AntecedentesDocumentoDevolucion :data="documentoAgendamiento" />

  <AgendamientoDevolucion ref="formDataAgendamientoDevolucion" />

  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnNextTeleported
    class="btn-primary"
    icon="pi pi-angle-double-right"
    label="Continuar"
    @click="enviarAgendamiento()"
  />
</section>
</template>

<script setup>
// COMPONENTS
import PageHeader from '@/modules/common/components/PageHeader.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AntecedentesCatalogo from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesCatalogo.vue'
import AgendamientoDevolucion from '@/modules/catalogo-documental-digital/components/agendamiento-devolucion-documento/AgendamientoDevolucion.vue'
import AntecedentesDocumentoDevolucion from '@/modules/catalogo-documental-digital/components/agendamiento-devolucion-documento/AntecedentesDocumentoDevolucion.vue'
import AntecedentesSolicitante from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesSolicitante.vue'

// UTILS
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'

// COMPONSABLES
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { useSolicitudesEncargadoBodega } from '@/modules/catalogo-documental-digital/composables'
const { launchConfirmDialog } = useConfirmDialog()
const { toastError, TOAST_MESSAGES, toastSuccess } = useAppToast()
const { taskId, idSolicitud, antecedentesSolicitud, catalogoSolicitud, documentoAgendamiento, solicitudesEncargadoBodega_generarAgendamientoParaDocumentoFisico } = useSolicitudesEncargadoBodega()

// VALUES
const label = ref('')
const router = useRouter()
const showLoader = ref(false)
const header = ref('No Agenda Devolución')
const formDataAgendamientoDevolucion = ref(null)

// LOGIC
onMounted(async () => {

})

function enviarAgendamiento () {
  if (!formDataAgendamientoDevolucion.value.isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  showLoader.value = true
  if (formDataAgendamientoDevolucion.value.formData.contactoEfectivo === 0) {
    label.value = 'El Documento físico permanecerá en la bodega temporal'
  } else if (formDataAgendamientoDevolucion.value.formData.contactoEfectivo && formDataAgendamientoDevolucion.value.formData.agendaRetiro === 0) {
    label.value = 'El Documento físico irá a destrucción.'
  } else if (formDataAgendamientoDevolucion.value.formData.agendaRetiro && formDataAgendamientoDevolucion.value.formData.fechaDevolucion !== '') {
    header.value = 'Agenda Devolución'
    label.value = '¿Está seguro de querer Agendar Devolución?'
  }
  launchConfirmDialog({
    header: header.value,
    message: label.value,
    acceptLabel: 'Aceptar',
    rejectLabel: 'Cancelar',
    accept: () => {
      requestUtil({
        action: solicitudesEncargadoBodega_generarAgendamientoParaDocumentoFisico,
        payload: {
          ...formDataAgendamientoDevolucion.value.formData,
          taskId: taskId.value,
          idSolicitud: idSolicitud.value
        },
        resolve: () => {
          showLoader.value = false
          toastSuccess('Agendamiento existoso')
          router.push({ name: 'CddBandejaEncargadoBodega' })
        },
        reject: () => {
          showLoader.value = false
          toastError('Ha ocurrido un error al agendar la devolución')
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
  router.push({ name: 'CddBandejaEncargadoBodega' })
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
