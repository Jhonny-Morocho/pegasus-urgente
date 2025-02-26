<template>
<AppFieldset
  collapsed
  legend="Delitos"
  toggleable
>
  <div class="ml-auto col-12">
    <AppFilters
      v-model="delitosFilters.filters"
      class="mb-5 w-full input-group"
      no-date-filters
      @filter="getDelitos"
    />
  </div>
  <LoaderSkeleton
    v-if="delitos.isLoading"
    height="220px"
  />
  <TablaDelitos
    v-else
    v-model:first="delitosFilters.firstRecord"
    class="w-full"
    :loading="delitosFilters.isLoading"
    read-only
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="delitos"
    @page="getDelitos"
  />
</AppFieldset>
</template>

<script setup>
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { reactive, onMounted, defineProps } from 'vue'
import TablaDelitos from '@/modules/gestion-solicitudes/components/tablas/TablaDelitos.vue'
import { useDelitoStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import AppFilters from '@/modules/common/components/AppFilters.vue'

const delitosFilters = reactive({
  filters: {
    buscador: null
  },
  firstRecord: 0,
  isLoading: false
})

const { paginacion, delitos, delito_getDelitoByIdDenuncia } = useDelitoStore()
const props = defineProps({
  ruc: {
    type: String,
    required: true
  }
})
const getDelitos = (pagination = undefined) => {
  if (!pagination) {
    delitosFilters.firstRecord = 0
  }

  requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: props?.ruc,
      params: {
        ...delitosFilters.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: delitosFilters.filters.status,
        buscador: delitosFilters.filters.buscador?.trim().length
          ? delitosFilters.filters.buscador
          : undefined
      }
    },
    loader: (l) => (delitosFilters.isLoading = l),
    resolve: () => {
      delitosFilters.filters.buscador = ''
    }
  })
}

onMounted(() => {
  getDelitos()
})
</script>
