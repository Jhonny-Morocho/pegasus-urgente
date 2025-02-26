<template>
<AppFieldset
  collapsed
  legend="Anotaciones"
  toggleable
>
  <div class="ml-auto col-12">
    <AppFilters
      v-model="anotacionesSetup.filters"
      class="mb-5 w-full input-group"
      no-date-filters
      @filter="getAnotaciones"
    />
  </div>
  <LoaderSkeleton
    v-if="anotacionesSetup.isLoading"
    height="220px"
  />
  <TablaAnotaciones
    v-else
    v-model:first="anotacionesSetup.firstRecord"
    class="w-full"
    :loading="anotacionesSetup.isLoading"
    read-only
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="anotaciones"
    @page="getAnotaciones"
  />
</AppFieldset>
</template>

<script setup>
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { reactive, onMounted } from 'vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import TablaAnotaciones from '@/modules/gestion-solicitudes/components/tablas/TablaAnotaciones.vue'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables/useGestionSolicitudesStore'
import { requestUtil } from '@/utils'

const anotacionesSetup = reactive({
  filters: {
    buscador: null
  },
  firstRecord: 0,
  isLoading: false
})

const { paginacion, idDenuncia, anotaciones, gestionSolicitudes_getAnotaciones } = useGestionSolicitudesStore()

function getAnotaciones (pagination = undefined) {
  if (!pagination) {
    anotacionesSetup.firstRecord = 0
  }

  requestUtil({
    action: gestionSolicitudes_getAnotaciones,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        ...anotacionesSetup.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: anotacionesSetup.filters.status,
        buscador: anotacionesSetup.filters.buscador?.trim().length
          ? anotacionesSetup.filters.buscador
          : undefined
      }
    },
    loader: (l) => (anotacionesSetup.isLoading = l),
    resolve: () => {
      anotacionesSetup.filters.buscador = ''
    }
  })
}

onMounted(() => {
  getAnotaciones()
})
</script>
