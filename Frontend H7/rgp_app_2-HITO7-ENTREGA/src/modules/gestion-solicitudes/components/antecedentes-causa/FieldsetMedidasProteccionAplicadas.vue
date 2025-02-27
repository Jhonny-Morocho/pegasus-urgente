<template>
<AppFieldset
  collapsed
  legend="Medidas de Protección Aplicadas"
  toggleable
>
  <div class="ml-auto col-12">
    <AppFilters
      v-model="medidas.filters"
      class="mb-5 w-full input-group"
      no-date-filters
      @filter="getMedidasProteccion"
    />
  </div>
  <LoaderSkeleton
    v-if="medidas.isLoading"
    height="220px"
  />
  <TablaMedidasAplicadas
    v-else
    v-model:first="medidas.firstRecord"
    class="w-full"
    :loading="medidas.isLoading"
    read-only
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="medidasProteccion"
    @page="getMedidasProteccion"
  />
</AppFieldset>
</template>

<script setup>
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { reactive, onMounted } from 'vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import TablaMedidasAplicadas from '@/modules/gestion-solicitudes/components/tablas/TablaMedidasAplicadas.vue'
import { requestUtil } from '@/utils'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables/useGestionSolicitudesStore'

const medidas = reactive({
  filters: {
    buscador: null
  },
  firstRecord: 0,
  isLoading: false
})

const { paginacion, idDenuncia, medidasProteccion, gestionSolicitudes_getMedidasProteccion } = useGestionSolicitudesStore()

function getMedidasProteccion (pagination = undefined) {
  if (!pagination) {
    medidas.firstRecord = 0
  }

  requestUtil({
    action: gestionSolicitudes_getMedidasProteccion,
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
  getMedidasProteccion()
})
</script>
