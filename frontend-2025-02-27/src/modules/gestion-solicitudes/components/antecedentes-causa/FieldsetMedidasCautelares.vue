<template>
<AppFieldset
  collapsed
  legend="Medidas Cautelares/Intrusivas Aplicadas"
  toggleable
>
  <div class="ml-auto col-12">
    <AppFilters
      v-model="medidas.filters"
      class="mb-5 w-full input-group"
      no-date-filters
      @filter="getMedidasCautelares"
    />
  </div>
  <LoaderSkeleton
    v-if="medidas.isLoading"
    height="220px"
  />
  <TablaMedidasCautelares
    v-else
    v-model:first="medidas.firstRecord"
    class="w-full"
    :loading="medidas.isLoading"
    read-only
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="medidasCautelares"
    @page="getMedidasCautelares"
  />
</AppFieldset>
</template>

<script setup>
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import { reactive, onMounted } from 'vue'
import TablaMedidasCautelares from '@/modules/gestion-solicitudes/components/tablas/TablaMedidasCautelares.vue'
import { requestUtil } from '@/utils'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables/useGestionSolicitudesStore'

const medidas = reactive({
  filters: {
    buscador: null
  },
  firstRecord: 0,
  isLoading: false
})

const { paginacion, idDenuncia, medidasCautelares, gestionSolicitudes_getMedidasCautelares } = useGestionSolicitudesStore()

function getMedidasCautelares (pagination = undefined) {
  if (!pagination) {
    medidas.firstRecord = 0
  }

  requestUtil({
    action: gestionSolicitudes_getMedidasCautelares,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        ...medidas.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: medidas.filters.status,
        buscador: medidas.filters.buscador?.trim().length
          ? medidas.filters.buscador
          : undefined
      }
    },
    loader: (l) => (medidas.isLoading = l),
    resolve: () => {
      medidas.filters.buscador = ''
    }
  })
}

onMounted(() => {
  getMedidasCautelares()
})
</script>
