<template>
<main>
  <section class="w-full p-fluid">
    <AppDropdown
      id="agrupar-por"
      v-model="agruparPor"
      class="col-12 md:col-4"
      label="Agrupar por"
      option-label="descripcion"
      option-value="value"
      :options="agruparOptions"
      placeholder
    />
  </section>
  <section class="w-full">
    <AppFieldset legend="Documentos y Archivos">
      <section

        id="procedencia"
        class="w-full"
      >
        <AppFilters
          v-model="documentosFilters.filters"
          class="mb-5"
          no-date-filters
          @filter="documentosFilters"
        />
        <TablaDocumentosProcedencia
          v-model:selection="documentosSeleccionados"
          :loading="tablaDocumentos.isLoading"
          :rows="paginacion?.tamanoPagina"
          :total-records="paginacion?.elementosTotales"
          :value="documentos"
          @page="getDocumentos"
        />
      </section>
    </AppFieldset>
  </section>
</main>
</template>

<script setup>
// COMPONENTS
import TablaDocumentosProcedencia from '../components/catalogo-documental-digital/TablaDocumentosProcedencia.vue'

// UTILS
import { reactive, ref, onMounted } from 'vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'

// COMPOSABLES
import { requestUtil } from '@/utils'
import { useFichaCausaStore } from '../composables'
import { useAppToast } from '@/modules/common/composables'
import { useDocumentoStore } from '@/modules/global/composables'

const { ruc } = useFichaCausaStore()
const { toastError } = useAppToast()
const { documentos, paginacion, documento_getDocumentosByCatalogoCDD } = useDocumentoStore()

// VALUES
const documentosSeleccionados = ref([])
const agruparPor = ref('procedencia')
const documentosFilters = reactive({
  first: 0,
  isLoading: false,
  filters: {
    buscador: undefined
  }
})
const tablaDocumentos = reactive({
  isLoading: false,
  fisrtRecord: 0

})
const agruparOptions = [
  { value: 'clases', descripcion: 'Clases Documentales' },
  { value: 'procedencia', descripcion: 'Procedencia' }
]

// LOGIC
function getDocumentos (pagination = undefined) {
  if (!pagination) {
    documentosFilters.first = 0
  }
  requestUtil({
    action: documento_getDocumentosByCatalogoCDD,
    payload: {
      payload: {
        nombreCatalogo: ruc.value
      },
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    },
    loading: (l) => { tablaDocumentos.isLoading = l },
    reject: () => { toastError('Ocurrió un error al cargar los documentos') }
  })
}

onMounted(() => {
  getDocumentos()
})
</script>
