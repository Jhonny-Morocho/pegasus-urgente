<template>
<AppFieldset
  collapsed
  legend="Pautas aplicadas"
  toggleable
>
  <div class="ml-auto col-12">
    <AppFilters
      v-model="pautas.filters"
      class="mb-5 w-full input-group"
      no-date-filters
      @filter="getPautasAplicadas"
    />
  </div>
  <LoaderSkeleton
    v-if="pautas.isLoading"
    height="220px"
  />
  <TablaPautasAplicadas
    v-else
    v-model:first="pautas.firstRecord"
    class="w-full"
    :loading="pautas.isLoading"
    read-only
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="pautasAplicadas"
    @page="getPautasAplicadas"
  />
</AppFieldset>
</template>

<script setup>
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { reactive, onMounted } from 'vue'
import TablaPautasAplicadas from '@/modules/gestion-solicitudes/components/tablas/TablaPautasAplicadas.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import { requestUtil } from '@/utils'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables/useGestionSolicitudesStore'

const pautas = reactive({
  filters: {
    buscador: null
  },
  firstRecord: 0,
  isLoading: false
})

const { paginacion, idDenuncia, pautasAplicadas, gestionSolicitudes_getPautasAplicadas } = useGestionSolicitudesStore()

function getPautasAplicadas (pagination = undefined) {
  if (!pagination) {
    pautas.firstRecord = 0
  }

  requestUtil({
    action: gestionSolicitudes_getPautasAplicadas,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        ...pautas.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: pautas.filters.status,
        buscador: pautas.filters.buscador?.trim().length
          ? pautas.filters.buscador
          : undefined
      }
    },
    loader: (l) => (pautas.isLoading = l),
    resolve: () => {
      pautas.filters.buscador = ''
    }
  })
}

onMounted(() => {
  getPautasAplicadas()
})
</script>
