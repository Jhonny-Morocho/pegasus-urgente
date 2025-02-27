<template>
<section>
  <div class="col-12 grid mb-0 pb-0">
    <ul class="col-4 list-none">
      <li class="mb-4">
        <strong>Nombre de Catálogo: </strong> {{ props?.dataSolicitud?.nombre_catalogo }}
      </li>
      <li class="mb-4">
        <strong>Fecha creación :</strong> {{ formatDate(props.dataSolicitud?.fecha_registro) }}
      </li>
    </ul>
    <AppFilters
      v-model="tablaDocumentos.filters"
      class="col-8"
      :no-date-filters="true"
      @filter="handleSearchCatalogo"
    />
  </div>

  <TablaVerCatalogo
    :rows="paginacionDocumentos?.tamanoPagina"
    style="width: 100%"
    :total-records="paginacionDocumentos?.elementosTotales"
    :value="documentos"
    @page="handleSearchCatalogo"
  />
</section>
</template>

<script setup>
// COMPONENTS
import TablaVerCatalogo from '@/modules/catalogo-documental-digital/components/solicitud-creacion/TablaVerCatalogo.vue'

// UTILS
import { onMounted, inject, reactive } from 'vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'

// COMPOSABLES
import { requestUtil, dateTimeUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'
import { useCreacionYGestionDeCDD } from '@/modules/catalogo-documental-digital/composables'

const { toastSuccess, toastError } = useAppToast()
const dialogRef = inject('dialogRef')
const { catalogo, documentos, creacionYGestionDeCDD_buscarCatalogoByNombre, paginacionDocumentos } = useCreacionYGestionDeCDD()

// VALUES
const props = reactive({
  ...dialogRef.value?.data
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
onMounted(async () => {
  handleSearchCatalogo()
})

function formatDate (date) {
  return dateTimeUtil.formatToFrontend(date)
}

function handleSearchCatalogo (pagination = undefined) {
  console.log('asadasd')
  if (!pagination) {
    tablaDocumentos.firstRecord = 0
  }
  const payload = {
    tipoCatalogo: props.dataSolicitud.id_tipo_catalogo,
    value: props.dataSolicitud.nombre_catalogo,
    nombreCatalogo: props.dataSolicitud.nombre_catalogo
  }
  console.log(catalogo.value)
  requestUtil({
    action: creacionYGestionDeCDD_buscarCatalogoByNombre,
    payload: {
      payload: payload,
      params: {
        search: tablaDocumentos.filters.buscador?.trim().length ? tablaDocumentos.filters.buscador : undefined,
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    },
    resolve: () => {
      toastSuccess('Se encontró un catálogo exitosamente')
    },

    reject: () => {
      toastError(`La solicitud no pudo ser cargado con exitosamente`)
    }
  })
}
</script>
<style scoped>
.p-menu p-component p-menu-overlay p-ripple-disabled {
  z-index: 100000000 !important;
}
</style>
