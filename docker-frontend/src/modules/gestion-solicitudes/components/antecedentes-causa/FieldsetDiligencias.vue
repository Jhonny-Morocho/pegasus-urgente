<template>
<AppFieldset
  collapsed
  legend="Diligencia Realizadas e Instruidas"
  toggleable
>
  <div class="ml-auto col-12">
    <AppFilters
      v-model="diligenciasSetup.filters"
      class="mb-5 w-full input-group"
      no-date-filters
      @filter="getDiligencias"
    />
  </div>
  <LoaderSkeleton
    v-if="diligenciasSetup.isLoading"
    height="220px"
  />
  <TablaDiligenciasRealizadas
    v-else
    v-model:first="diligenciasSetup.firstRecord"
    class="w-full"
    :loading="diligenciasSetup.isLoading"
    read-only
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="diligencias"
    @page="getDiligencias"
  />
</AppFieldset>
</template>

<script setup>
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { reactive, onMounted } from 'vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import TablaDiligenciasRealizadas from '@/modules/gestion-solicitudes/components/tablas/TablaDiligenciasRealizadas.vue'
import { requestUtil } from '@/utils'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables/useGestionSolicitudesStore'

const diligenciasSetup = reactive({
  filters: {
    buscador: null
  },
  firstRecord: 0,
  isLoading: false
})

const { paginacion, idDenuncia, diligencias, gestionSolicitudes_getDiligencias } = useGestionSolicitudesStore()

function getDiligencias (pagination = undefined) {
  if (!pagination) {
    diligenciasSetup.firstRecord = 0
  }

  requestUtil({
    action: gestionSolicitudes_getDiligencias,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        ...diligenciasSetup.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: diligenciasSetup.filters.status,
        buscador: diligenciasSetup.filters.buscador?.trim().length
          ? diligenciasSetup.filters.buscador
          : undefined
      }
    },
    loader: (l) => (diligenciasSetup.isLoading = l),
    resolve: () => {
      diligenciasSetup.filters.buscador = ''
    }
  })
}

onMounted(() => {
  getDiligencias()
})
</script>
