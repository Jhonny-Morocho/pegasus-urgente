<template>
<LoaderSkeleton
  v-if="showLoader"
  height="1000px"
/>
<section v-else>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Solicitud de Eliminación de Documento"
  />

  <FieldsetAntecedentesDeLCatalogo
    ref="datosBusquedaCatalogo"
    :legend="'Antecedentes de la Solicitud de Eliminación'"
    @is-show-result="changeVisible"
  />

  <AppFieldset
    v-if="showResult"
    class="p-fluid"
    legend="Documentos o archivos contenidos en catálogo "
  >
    <div v-if="isLoading">
      <LoaderSkeleton />
    </div>

    <TablaEliminacionDocumento
      v-else
      v-model:first="tablaDocumentos.firstRecord"
      v-model:selection="documentosSeleccionados"
      :loading="loading"
      :rows="paginacionDocumentos?.tamanoPagina"
      :style="{
        width: '100%'
      }"
      :total-records="paginacionDocumentos?.elementosTotales"
      :value="documentos"
      @page="handleSearchCatalogo"
      @update-seleccionados="updateSeleccion"
    />
    <div class="py-2 w-full">
      <AppTextarea
        id="observaciones"
        v-model="formData.observaciones"
        :auto-resize="true"
        class="p-fluid col-12"
        cols="50"
        placeholder="Observaciones"
        rows="10"
      />
    </div>
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnNextTeleported
    :disabled="documentosSeleccionados.length === 0 || hayDocumentoSinMetodo"
    icon="pi pi-send"
    label="Enviar Solicitud "
    :loading="loadingCrearCatalogo"
    @click="enviarSolicitud()"
  />
</section>
</template>

<script setup>
// COMPONENTS
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import TablaEliminacionDocumento from '@/modules/catalogo-documental-digital/components/antecedentes-catalogo-eliminacion/TablaEliminacionDocumento.vue'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import FieldsetAntecedentesDeLCatalogo from '@/modules/catalogo-documental-digital/components/solicitud-gestion-documento-archivo/FieldsetAntecedentesDeLCatalogo.vue'

// UTILS
import store from '@/store'
import { useRouter } from 'vue-router'
import { reactive, ref, computed, onMounted } from 'vue'

// COMPOSABLES
import { requestUtil } from '@/utils'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { useCreacionYGestionDeCDD, useSolicitudesFiscalCDD, useMantenedorCDD } from '@/modules/catalogo-documental-digital/composables'
const { motivosEliminacion } = useMantenedorCDD()
const { toastError, toastSuccess } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const { documentos, paginacionDocumentos, creacionYGestionDeCDD_buscarCatalogoByNombre, creacionYGestionDeCDD_SET_DEFAULT_STATE } = useCreacionYGestionDeCDD()
const { solicitudesFiscalCDD_solicitudEliminacionArchivo } = useSolicitudesFiscalCDD()

// VALUES
const archivos = ref([])
const loading = ref(false)
const router = useRouter()
const showLoader = ref(false)
const datosBusquedaCatalogo = ref({})
const documentosSeleccionados = ref([])
const loadingCrearCatalogo = ref(false)

const formData = reactive({
  observaciones: ''
})

const hayDocumentoSinMetodo = computed(() => {
  const hayDocumento = documentosSeleccionados.value?.find(
    (d) => d.eliminacion === undefined
  )
  return hayDocumento
})

const tablaDocumentos = reactive({
  page: 0,
  size: 10,
  isLoading: false,
  filters: {
    search: undefined
  },
  firstRecord: 0
})

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
  requestUtil({ action: creacionYGestionDeCDD_SET_DEFAULT_STATE })
})

const solicitante = reactive({
  id_solicitante: store.state.session.user.sub,
  nombre: store.state.session.user.name
})

function setDataSolicitud () {
  documentosSeleccionados.value.forEach((d) => {
    const motivo = motivosEliminacion.value.find(
      (m) => m.codigo === d.eliminacion
    )
    const item = {
      archivoFilenetId: d.idFilenet,
      motivoEliminacionId: motivo.id
    }

    archivos.value.push(item)
  })
}

function setDataSolicitante () {
  const fiscalia = store.state.session.user.fiscalias.find(
    (f) => f.default === true
  )
  solicitante.fiscalia = fiscalia.fiscalia
  if (store.state.session.user.telefono) {
    solicitante.telefono = store.state.session.user.telefono
  }
  if (store.state.session.user.correo) {
    solicitante.correo = store.state.session.user.correo
  }
  if (store.state.session.user.anexo) {
    solicitante.anexo = store.state.session.user.anexo
  }
  if (store.state.session.user.cargo) {
    solicitante.cargo = store.state.session.user.cargo
  }
}

function enviarSolicitud () {
  if (documentosSeleccionados.value.length === 0) {
    toastError('Debe seleccionar al menos un documento a eliminar')
    return
  }
  showLoader.value = true
  launchConfirmDialog({
    acceptLabel: 'Aceptar',
    rejectLabel: 'Cancelar',
    header: 'Enviar Solicitud',
    message: '¿Está seguro de querer Enviar la Solicitud de Eliminación?',
    accept: () => {
      setDataSolicitud()
      setDataSolicitante()
      requestUtil({
        action: solicitudesFiscalCDD_solicitudEliminacionArchivo,
        payload: {
          observaciones: formData.observaciones,
          catalogoId: documentos.value[0].idCatalogo,
          solicitante: solicitante,
          archivos: archivos.value
        },
        resolve: () => {
          showLoader.value = false
          toastSuccess('Solicitud de Eliminación enviada correctamente')
          router.push({ name: 'BandejaFiscalCdd' })
        },
        reject: () => {
          showLoader.value = false
          toastError('Ha ocurrido un error al enviar la solicitud. Intente nuevamente')
          router.push({ name: 'BandejaFiscalCdd' })
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
  router.push({ name: 'BandejaFiscalCdd' })
}

const showResult = ref(false)
function changeVisible (result) {
  showResult.value = result
}

function handleSearchCatalogo (pagination = undefined) {
  loading.value = true
  if (!pagination) {
    tablaDocumentos.firstRecord = 0
  }

  requestUtil({
    action: creacionYGestionDeCDD_buscarCatalogoByNombre,
    payload: {
      payload: datosBusquedaCatalogo.value.formData,
      params: {
        search: tablaDocumentos?.filters?.buscador?.trim().length
          ? tablaDocumentos.filters.buscador
          : undefined,
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    },
    resolve: () => {
      loading.value = false
    },

    reject: () => {
      loading.value = false
      toastError(
        `Ha ocurrido un error con el servidor, por favor intente nuevamente.`
      )
    }
  })
}
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
