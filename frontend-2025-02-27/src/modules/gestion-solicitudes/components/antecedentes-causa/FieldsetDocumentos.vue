<template>
<AppFieldset
  collapsed
  legend="Documentos o Archivos"
  toggleable
>
  <div class="ml-auto col-12">
    <AppFilters
      v-model="docSetup.filters"
      class="mb-5 w-full input-group"
      no-date-filters
      @filter="getDocumentos"
    />
  </div>
  <LoaderSkeleton
    v-if="docSetup.isLoading"
    height="220px"
  />
  <TablaDocumentos
    v-else
    v-model:first="docSetup.firstRecord"
    class="w-full"
    :loading="docSetup.isLoading"
    read-only
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="documentos"
    @page="getDocumentos"
  />
</AppFieldset>
</template>

<script setup>
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { reactive, onMounted } from 'vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import TablaDocumentos from '@/modules/gestion-solicitudes/components/tablas/TablaDocumentos.vue'

import { requestUtil } from '@/utils'
import { useDocumentoStore } from '@/modules/global/composables'

const docSetup = reactive({
  filters: {
    buscador: null
  },
  firstRecord: 0,
  isLoading: false
})

const { documentos, paginacion, documento_getDocumentosByIdDenuncia } = useDocumentoStore()

function getDocumentos (pagination = undefined) {
  if (!pagination) {
    docSetup.firstRecord = 0
  }

  requestUtil({
    action: documento_getDocumentosByIdDenuncia,
    payload: {
      idDenuncia: '',
      params: {
        ...docSetup.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: docSetup.filters.status,
        buscador: docSetup.filters.buscador?.trim().length
          ? docSetup.filters.buscador
          : undefined
      }
    },
    loader: (l) => (docSetup.isLoading = l),
    resolve: () => {
      docSetup.filters.buscador = ''
    }
  })
}

onMounted(() => {
  getDocumentos()
})
</script>
