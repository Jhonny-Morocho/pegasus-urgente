<template>
<AppFieldset
  collapsed
  legend="Relaciones"
  :toggleable="true"
>
  <div class="ml-auto col-12">
    <AppFilters
      v-model="relacionesFilters.filters"
      class="mb-5 w-full input-group"
      no-date-filters
      @filter="getRelaciones"
    />
  </div>
  <LoaderSkeleton
    v-if="relacionesFilters.isLoading"
    height="220px"
  />
  <TablaRelaciones
    v-else
    class="w-full"
    :loading="relacionesFilters.isLoading"
    read-only
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="relaciones"
    @page="getRelaciones"
  />
</AppFieldset>
</template>

<script setup>
import { defineProps, reactive, onMounted } from 'vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import TablaRelaciones from '@/modules/termino-postermino/components/tablas/TablaRelaciones.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { useRelacionesStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'

const props = defineProps({
  ruc: {
    type: String,
    required: true
  }
})

const relacionesFilters = reactive({
  filters: {
    buscador: null
  },
  firstRecord: 0,
  isLoading: false
})

const { paginacion, relaciones, relaciones_getRelacionesByIdGlobal } = useRelacionesStore()

const getRelaciones = (pagination = undefined) => {
  if (!pagination) {
    relacionesFilters.firstRecord = 0
  }

  requestUtil({
    action: relaciones_getRelacionesByIdGlobal,
    payload: {
      idGlobal: props?.ruc,
      params: {
        ...relacionesFilters.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: relacionesFilters.filters.status,
        buscador: relacionesFilters.filters.buscador?.trim().length ? relacionesFilters.filters.buscador : undefined
      }
    },
    loader: (l) => (relacionesFilters.isLoading = l),
    resolve: () => {
      relacionesFilters.filters.buscador = ''
    }
  })
}

onMounted(() => {
  getRelaciones()
})
</script>
