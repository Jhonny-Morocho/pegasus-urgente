<template>
<LoaderSkeleton
  v-show="showLoader"
  height="1000px"
/>
<section v-show="!showLoader">
  <PageHeader
    bandeja-custodio
    :items-menu-superior="itemsMenuSuperior"
    page-title="Ingreso de documento oficina de partes"
  />
  <AppFieldset
    class="p-fluid my-0 py-1"
    v-bind="$attrs"
    :legend="'Buscar Catálogo por RUC'"
  >
    <AppForm
      id="creacionSolicitudOfPartes"
      class="col-12"
      :form-submitted="formSubmitted"
      validation-scope="formCreacionSolicitudOfPartes"
    >
      <div class="grid formgrid flex justify-content-start">
        <div class="col-4">
          <AppInput
            id="nombre-catalogo"
            v-model="formData.nombreCatalogo"
            label="Folio"
            max-length="50"
            :rules="{
              required,
              minLength: minLength(3)
            }"
          />
        </div>
      </div>
    </AppForm>
  </AppFieldset>

  <div
    class="grid formgrid pt-4 pb-4 flex align-items-center justify-content-end mr-0"
  >
    <div class="col-3 pl-7">
      <Button
        class="p-button-outlined w-full"
        icon="pi pi-search"
        icon-pos="right"
        label="Buscar"
        @click="handleSearchCatalogo()"
      />
    </div>
  </div>

  <AntecedentesCatalogo
    v-if="mostrarResultados"
    :data="catalogo[0]"
  />

  <AppFieldset
    v-if="mostrarResultados"
    class="p-fluid my-6 py-1"
    v-bind="$attrs"
    legend="Documentos contenidos en el catálogo"
  >
    <TablaDocumentosContenidosEnCatalogo
      :loading="isLoadingTable"
      :origen-tabla="'agregar'"
      :rows="paginacionDocumentos?.tamanoPagina"
      :total-records="paginacionDocumentos?.elementosTotales"
      @page="handleSearchCatalogo"
    />
  </AppFieldset>

  <AntecedentesDelDocumento
    v-show="mostrarResultados"
    ref="ingresoDocumento"
    :catalogo="catalogo"
    :es-oficina-partes="true"
    :legend="'Antecedentes del Documento'"
    @set-loader="setLoader"
  />

  <AppBtnsSteps @back-step="handleBackStep" />
</section>
</template>

<script setup>
// COMPONENTS
import PageHeader from '@/modules/common/components/PageHeader.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AntecedentesDelDocumento from '@/modules/catalogo-documental-digital/components/globals/AntecedentesDelDocumento'
import AntecedentesCatalogo from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesCatalogo'
import TablaDocumentosContenidosEnCatalogo from '@/modules/catalogo-documental-digital/components/solicitud-gestion-documento-archivo/TablaDocumentosContenidosEnCatalogo.vue'

// UTILS
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'

// COMPOSABLES
import { requestUtil } from '@/utils'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useCreacionYGestionDeCDD, useMantenedorCDD } from '@/modules/catalogo-documental-digital/composables'
const router = useRouter()
const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()
const { catalogo, creacionYGestionDeCDD_buscarCatalogoByNombre, creacionYGestionDeCDD_SET_DEFAULT_STATE, paginacionDocumentos } = useCreacionYGestionDeCDD()
const {
  mantenedorCDD_getNivelAcceso,
  mantenedorCDD_getFormatoRecepcion,
  mantenedorCDD_getClaseDocumental,
  mantenedorCDD_getProcedencia,
  mantenedorCDD_getNivelFirma,
  mantenedorCDD_getIdiomas,
  mantenedorCDD_getTipoCatalogo
} = useMantenedorCDD()

// VALUES
const showLoader = ref(false)
const isLoadingTable = ref(false)
const ingresoDocumento = ref(null)
const mostrarResultados = ref(false)

const formData = reactive({
  nombreCatalogo: ''
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
const { formSubmitted, required, minLength, isFormValid } = useFormValidation({
  formData,
  validationScope: 'creacionSolicitudOfPartes'
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
  requestUtil({ action: mantenedorCDD_getTipoCatalogo })
})
function setLoader (value) {
  console.log(value)
  showLoader.value = value
}
function handleSearchCatalogo (pagination = undefined) {
  if (!pagination) {
    tablaDocumentos.firstRecord = 0
  }
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  requestUtil({
    action: creacionYGestionDeCDD_buscarCatalogoByNombre,
    payload: {
      payload: formData,
      params: {
        search: tablaDocumentos?.filters?.buscador?.trim().length
          ? tablaDocumentos.filters.buscador
          : undefined,
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    },
    resolve: () => {
      mostrarResultados.value = true
      isLoadingTable.value = true
      toastSuccess('Se encontró el catálogo exitosamente')
    },
    reject: () => {
      toastError(
        `No se encontró el catálogo ${formData.nombreCatalogo} en la búsqueda`
      )
    }
  })
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

function handleBackStep () {
  router.push({ name: 'CddBandejaOficinaPartes' })
}

</script>

<style scoped>
.end {
  text-align: end;
}
.Selection {
  font-size: 18px;
  padding-bottom: 15px;
  text-align: start;
}
</style>
