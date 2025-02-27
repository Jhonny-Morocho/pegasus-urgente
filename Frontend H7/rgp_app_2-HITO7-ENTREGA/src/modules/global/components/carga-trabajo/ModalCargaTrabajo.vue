<template>
<main>
  <AppFieldset
    legend="Distribucion Carga de Trabajo por Unidad"
  >
    <TablaCargaUnidad
      v-model:first="unidadFilter.firstRecord"
      :loading="unidadFilter.isLoading"
      :rows="paginacionCargaUnidad?.tamanoPagina"
      :total-records="paginacionCargaUnidad?.elementosTotales"
      :value="cargaUnidad"
      @page="getCargaUnidad"
    />
  </AppFieldset>
  <AppFieldset
    legend="Distribucion Carga de Trabajo por Fiscal"
  >
    <TablaCargaFiscal
      v-model:first="fiscalFilter.firstRecord"
      :loading="fiscalFilter.isLoading"
      :rows="paginacionCargaFiscal?.tamanoPagina"
      :total-records="paginacionCargaFiscal?.elementosTotales"
      :value="cargaFiscal"
      @page="getCargaFiscal"
    />
  </AppFieldset>
</main>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { requestUtil } from '@/utils'
import { useAppGlobalProperties } from '@/modules/common/composables'
import { useCargaTrabajoStore, useMantenedorStore } from '@/modules/global/composables'
import TablaCargaUnidad from './TablaCargaUnidad.vue'
import TablaCargaFiscal from './TablaCargaFiscal.vue'

const { $userFiscaliaActual } = useAppGlobalProperties()

const unidadFilter = reactive({
  first: 0,
  isLoading: false
})

const fiscalFilter = reactive({
  first: 0,
  isLoading: false
})

const {
  cargaFiscal,
  cargaUnidad,
  paginacionCargaFiscal,
  paginacionCargaUnidad,
  cargaTrabajo_getCargaFiscal,
  cargaTrabajo_getCargaUnidad
} = useCargaTrabajoStore()

const {
  mantenedor_getEspecialidadesFiscalia
} = useMantenedorStore()

function getCargaFiscal (pagination = undefined) {
  if (!pagination) {
    fiscalFilter.first = 0
  }

  requestUtil({
    action: cargaTrabajo_getCargaFiscal,
    payload: {
      // OJO EN idFiscaliaDestino VA EL CODIGO (901, 912, etc) NO EL UUID DE LA FISCALIA
      codigoFiscalia: $userFiscaliaActual.value?.fiscalia,
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    loader: (loadState) => { fiscalFilter.isLoading = loadState }
  })
}

function getCargaUnidad (pagination = undefined) {
  if (!pagination) {
    unidadFilter.first = 0
  }

  requestUtil({
    action: cargaTrabajo_getCargaUnidad,
    payload: {
      // OJO EN idFiscaliaDestino VA EL CODIGO (901, 912, etc) NO EL UUID DE LA FISCALIA
      idFiscaliaDestino: $userFiscaliaActual.value?.fiscalia,
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    loader: (loadState) => { unidadFilter.isLoading = loadState }
  })
}

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getEspecialidadesFiscalia })
}

onMounted(() => {
  getDataMantenedor()
  getCargaUnidad()
  getCargaFiscal()
})
</script>
