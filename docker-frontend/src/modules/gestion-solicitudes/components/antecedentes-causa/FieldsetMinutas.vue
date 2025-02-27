<template>
<AppFieldset
  collapsed
  legend="Minutas/Escritos"
  toggleable
>
  <div class="ml-auto col-12">
    <AppFilters
      v-model="minutasSetup.filters"
      class="mb-5 w-full input-group"
      no-date-filters
      @filter="getMinutas"
    />
  </div>
  <LoaderSkeleton
    v-if="minutasSetup.isLoading"
    height="220px"
  />
  <TablaMinutas
    v-else
    v-model:first="minutasSetup.firstRecord"
    class="w-full"
    :loading="minutasSetup.isLoading"
    read-only
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="minutas"
    @page="getMinutas"
  />
</AppFieldset>
</template>

<script setup>
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { reactive, onMounted } from 'vue'
import TablaMinutas from '@/modules/gestion-solicitudes/components/tablas/TablaMinutas.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import { requestUtil } from '@/utils'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables/useGestionSolicitudesStore'

const minutasSetup = reactive({
  filters: {
    buscador: null
  },
  firstRecord: 0,
  isLoading: false
})

const { paginacion, idDenuncia, minutas, gestionSolicitudes_getMinutas } = useGestionSolicitudesStore()

function getMinutas (pagination = undefined) {
  if (!pagination) {
    minutasSetup.firstRecord = 0
  }

  requestUtil({
    action: gestionSolicitudes_getMinutas,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        ...minutasSetup.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: minutasSetup.filters.status,
        buscador: minutasSetup.filters.buscador?.trim().length
          ? minutasSetup.filters.buscador
          : undefined
      }
    },
    loader: (l) => (minutasSetup.isLoading = l),
    resolve: () => {
      minutasSetup.filters.buscador = ''
    }
  })
}

onMounted(() => {
  getMinutas()
})
</script>
