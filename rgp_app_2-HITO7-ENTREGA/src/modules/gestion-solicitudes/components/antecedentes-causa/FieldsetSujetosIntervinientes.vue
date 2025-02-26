<template>
<AppFieldset
  collapsed
  legend="Sujetos/Intervinientes"
  toggleable
>
  <div class="ml-auto col-12">
    <AppFilters
      v-model="sujetos.filters"
      class="mb-5 w-full input-group"
      no-date-filters
      @filter="getSujetosIntervinientes"
    />
  </div>
  <LoaderSkeleton
    v-if="sujetos.isLoading"
    height="220px"
  />
  <TablaSujetosIntervinientes
    v-else
    v-model:first="sujetos.firstRecord"
    class="w-full"
    :loading="sujetos.isLoading"
    read-only
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="sujetosIntervinientes"
    @page="getSujetosIntervinientes"
  />
</AppFieldset>
</template>

<script setup>
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import TablaSujetosIntervinientes from '@/modules/gestion-solicitudes/components/tablas/TablaSujetosIntervinientes.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { reactive, onMounted, defineProps } from 'vue'
import { requestUtil } from '@/utils'
import { useSujetosIntervinientesStore } from '@/modules/global/composables'

const props = defineProps({
  ruc: {
    type: String,
    required: true
  }
})

const sujetos = reactive({
  filters: {
    buscador: null
  },
  firstRecord: 0,
  isLoading: false
})

const { paginacion, sujetosIntervinientes, sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()

const getSujetosIntervinientes = (pagination = undefined) => {
  if (!pagination) {
    sujetos.firstRecord = 0
  }

  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: props?.ruc,
      params: {
        ...sujetos.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: sujetos.filters.status,
        buscador: sujetos.filters.buscador?.trim().length
          ? sujetos.filters.buscador
          : undefined
      }
    },
    loader: (l) => (sujetos.isLoading = l),
    resolve: () => {
      sujetos.filters.buscador = ''
    }
  })
}

onMounted(() => {
  getSujetosIntervinientes()
})
</script>
