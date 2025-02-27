<template>
<LoaderSkeleton
  v-show="showLoader"
  height="1000px"
/>
<section v-show="!showLoader">
  <PageHeader
    bandeja-custodio
    :items-menu-superior="itemsMenuSuperior"
    page-title="Ingreso de solicitud de gestión de documento o archivo"
  />

  <FieldsetAntecedentesDeLCatalogo
    ref="creacionSolicitud"
    class="mt-4"
    :legend="'Antecedentes de la Solicitud'"
    @is-loading-table="changeLoadingTable"
    @is-show-result="changeVisible"
  />

  <TabView
    v-show="isShowResult"
    v-model:activeIndex="tabs.active"
    class="tabview mb-0 pb-0"
    @tab-change="tabChange"
  >
    <TabPanel
      v-for="tab in tabs.items"
      :key="tab.title"
      :header="tab.title"
    >
      <AppFieldset
        class="fieldset"
        legend="Documentos contenidos en el catálogo"
      >
        <TablaDocumentosContenidosEnCatalogo
          v-model:selection="documentoSeleccionado"
          :loading="isLoadingTable"
          :origen-tabla="tab.origenTabla"
          :rows="paginacionDocumentos?.tamanoPagina"
          :total-records="paginacionDocumentos?.elementosTotales"
          @filtrar-documentos="getDocumentosfiltrados"
          @page="getDocumentosfiltrados"
          @row-select="buscarBase64DocSeleccionado"
        />
      </AppFieldset>
    </TabPanel>
  </TabView>
  <AntecedentesDelDocumento
    v-if="tabs.active !== 2 && isShowResult"
    ref="refActualizarDocumento"
    :catalogo="catalogo"
    class="mt-0 pt-0"
    :documento-seleccionado="documentoSeleccionado"
    :legend="
      tabs.active === 0
        ? 'Agregar Documento o Archivo'
        : 'Actualizar Documento o Archivo'
    "
    :select-tab="tabs.active"
    :show-loader="loaderPopulate"
    :tab-change="change"
    @set-loader="setLoader"
  />

  <AppFieldset
    v-if="tabs.active === 2 && isShowResult"
    class="col-12 mt-0 pt-0"
    legend="Tipo de Salida y Observaciones"
  >
    <FieldsetTipoDesalida
      ref="dataSolicitud"
      :data-doc="documentoSeleccionado"
      @set-loader="setLoader"
    />
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />
</section>
</template>

<script setup>
// COMPONENTS
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import FieldsetAntecedentesDeLCatalogo from '@/modules/catalogo-documental-digital/components/solicitud-gestion-documento-archivo/FieldsetAntecedentesDeLCatalogo.vue'
import TablaDocumentosContenidosEnCatalogo from '@/modules/catalogo-documental-digital/components/solicitud-gestion-documento-archivo/TablaDocumentosContenidosEnCatalogo.vue'
import AntecedentesDelDocumento from '@/modules/catalogo-documental-digital/components/globals/AntecedentesDelDocumento'
import FieldsetTipoDesalida from '@/modules/catalogo-documental-digital/components/solicitud-gestion-documento-archivo/FieldsetTipoDesalida'
// UTILS
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { reactive } from '@vue/reactivity'

// COMPOSABLES
import { requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'
import { useMantenedorCDD, useCreacionYGestionDeCDD } from '@/modules/catalogo-documental-digital/composables'
const { toastSuccess, toastError } = useAppToast()
const {
  paginacionDocumentos, catalogo,
  creacionYGestionDeCDD_SET_DEFAULT_STATE,
  creacionYGestionDeCDD_getDocumentoById,
  creacionYGestionDeCDD_buscarCatalogoByNombre
} = useCreacionYGestionDeCDD()

const {
  mantenedorCDD_getNivelAcceso,
  mantenedorCDD_getFormatoRecepcion,
  mantenedorCDD_getClaseDocumental,
  mantenedorCDD_getProcedencia,
  mantenedorCDD_getNivelFirma,
  mantenedorCDD_getIdiomas
} = useMantenedorCDD()

// VALUES
const showLoader = ref(false)
const documentoSeleccionado = ref([])
const router = useRouter()
const isLoadingTable = ref(false)
const isShowResult = ref(false)
const change = ref(false)
const loaderPopulate = ref(false)
const refActualizarDocumento = ref(null)
const creacionSolicitud = ref(null)
const documentosEnBodega = ref(false)
const disponibleElectronico = ref(false)

const tabs = reactive({
  active: 0,
  items: [
    { title: 'Agregar Documento o Archivo', origenTabla: 'agregar' },
    { title: 'Actualizar documento o archivo ', origenTabla: 'actualizar' },
    { title: 'Recuperar Documento Físico', origenTabla: 'recuperar' }
  ]
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

// LOGIC
onMounted(() => {
  localStorage.clear()
  creacionYGestionDeCDD_SET_DEFAULT_STATE()
  requestUtil({ action: mantenedorCDD_getNivelAcceso })
  requestUtil({ action: mantenedorCDD_getFormatoRecepcion })
  requestUtil({ action: mantenedorCDD_getClaseDocumental })
  requestUtil({ action: mantenedorCDD_getProcedencia })
  requestUtil({ action: mantenedorCDD_getNivelFirma })
  requestUtil({ action: mantenedorCDD_getIdiomas })
})

watch(tabs, () => {
  if (tabs.active === 2) {
    documentosEnBodega.value = true
    disponibleElectronico.value = false
    buscarInfoCatalogo()
  } else if (tabs.active === 1) {
    disponibleElectronico.value = true
    documentosEnBodega.value = false
    buscarInfoCatalogo()
  } else if (tabs.active === 0) {
    disponibleElectronico.value = false
    documentosEnBodega.value = false
    buscarInfoCatalogo()
  }
})

function changeVisible (value) {
  console.log('show', value)
  isShowResult.value = value
}

function setLoader (value) {
  console.log(showLoader.value)
  showLoader.value = value
  console.log(showLoader.value)
}

function buscarInfoCatalogo () {
  requestUtil({
    action: creacionYGestionDeCDD_buscarCatalogoByNombre,
    payload: {
      payload: {
        ...creacionSolicitud.value.formData,
        disponibleFisico: documentosEnBodega.value,
        disponibleElectronico: disponibleElectronico.value
      },
      params: {
        search: tablaDocumentos?.filters?.buscador?.trim().length
          ? tablaDocumentos.filters.buscador
          : undefined,
        page: tablaDocumentos?.page || 0,
        size: tablaDocumentos?.rows || 10
      }
    }
  })
}

function tabChange () {
  if (refActualizarDocumento.value) {
    refActualizarDocumento.value.resetForm()
    documentoSeleccionado.value = []
  }
}

function getDocumentosfiltrados (tablaDocumentos) {
  requestUtil({
    action: creacionYGestionDeCDD_buscarCatalogoByNombre,
    payload: {
      payload: { nombreCatalogo: catalogo.value[0].nombreCatalogo },
      params: {
        search: tablaDocumentos?.filters?.buscador?.trim().length
          ? tablaDocumentos.filters.buscador
          : undefined,
        page: tablaDocumentos?.page || 0,
        size: tablaDocumentos?.rows || 10
      }
    },
    resolve: () => {
      toastSuccess('La busqueda se realizo con exito')
    },

    reject: () => {
      toastError(`La busqueda no se realizo con exito`)
    }
  })
}

function buscarBase64DocSeleccionado () {
  console.log('buscarBase64DocSeleccionado', documentoSeleccionado.value)

  if (tabs.active === 1) {
    loaderPopulate.value = true
    requestUtil({
      action: creacionYGestionDeCDD_getDocumentoById,
      payload: { id: documentoSeleccionado.value.idFilenet },
      resolve: () => {
        refActualizarDocumento.value.populateForm(documentoSeleccionado.value)
        loaderPopulate.value = false
      }
    })
  }
}

function changeLoadingTable (value) {
  isLoadingTable.value = value
}

function handleBackStep () {
  router.push({ name: 'BandejaFiscalCdd' })
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
</script>
<style scoped>
.buttons-steps__actions .p-button {
  background: transparent;
  border: 1px solid #2c6ddf;
  color: #2c6ddf;
}
.buttons-steps__actions {
  background: #2c6ddf;
  border: 1px solid #2c6ddf;
  color: #fff;
}
.fieldset {
  margin-bottom: 0px !important;
  padding-bottom: 0px !important;
}
</style>
