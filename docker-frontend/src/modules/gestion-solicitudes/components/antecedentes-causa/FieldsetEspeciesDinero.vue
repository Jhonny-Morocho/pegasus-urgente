<template>
<AppFieldset
  collapsed
  legend="Especies/Dinero"
  toggleable
>
  <div class="ml-auto col-12">
    <AppFilters
      v-model="especiesDinero.filters"
      class="mb-5 w-full input-group"
      no-date-filters
      @filter="getEspeciesDinero"
    />
  </div>
  <LoaderSkeleton
    v-if="especiesDinero.isLoading"
    height="220px"
  />
  <TablaEspeciesDinero
    v-else
    v-model:first="especiesDinero.firstRecord"
    class="w-full"
    :loading="especiesDinero.isLoading"
    read-only
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="especies"
    @page="getEspeciesDinero"
  />
</AppFieldset>
</template>

<script setup>
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { reactive, onMounted } from 'vue'
import TablaEspeciesDinero from '@/modules/gestion-solicitudes/components/tablas/TablaEspeciesDinero.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import { requestUtil } from '@/utils'
import { useEspeciesDineroStore, useMantenedorStore } from '@/modules/global/composables'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables/useGestionSolicitudesStore'

const {
  especies,
  paginacionEspecies: paginacion,
  especiesDinero_getEspecieByIdDenuncia
} = useEspeciesDineroStore()

const { idDenuncia } = useGestionSolicitudesStore()

const {
  mantenedor_getFamiliaEspecies,
  mantenedor_getTiposEspecies,
  mantenedor_getNombreTipoEspecie
} = useMantenedorStore()

function getDataMantenedor () {
  mantenedor_getFamiliaEspecies()
  mantenedor_getTiposEspecies()
  mantenedor_getNombreTipoEspecie()
}

const especiesDinero = reactive({
  filters: {
    buscador: null
  },
  firstRecord: 0,
  isLoading: false
})

const getEspeciesDinero = (pagination = undefined) => {
  if (!pagination) {
    especiesDinero.firstRecord = 0
  }

  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        ...especiesDinero.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: especiesDinero.filters.status,
        buscador: especiesDinero.filters.buscador?.trim().length
          ? especiesDinero.filters.buscador
          : undefined
      }
    },
    loader: (l) => (especiesDinero.isLoading = l),
    resolve: () => {
      especiesDinero.filters.buscador = ''
    }
  })
}

onMounted(() => {
  getDataMantenedor()
  getEspeciesDinero()
})
</script>
