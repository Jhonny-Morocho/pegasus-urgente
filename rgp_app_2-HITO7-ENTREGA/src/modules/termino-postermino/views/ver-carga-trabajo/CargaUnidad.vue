<template>
<section class="mt-4">
  <AppFieldset legend="Distribución de Carga de Trabajo por Unidad">
    <TablaCargaUnidad
      v-model:first="unidadFilter.firstRecord"
      :loading="unidadFilter.isLoading"
      :rows="cargaUnidad?.paginacion?.tamanoPagina"
      :total-records="cargaUnidad?.paginacion?.elementosTotales"
      :value="cargaUnidad?.data"
      @page="getCargaUnidad"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import TablaCargaUnidad from '@/modules/termino-postermino/components/ver-carga-trabajo/TablaCargaUnidad.vue'
import { requestUtil } from '@/utils'
import { onMounted, reactive } from 'vue-demi'
import { useAppGlobalProperties } from '@/modules/common/composables'
import { useGestionDireccionInvestigacionStore } from '../../composables'
import { useMantenedorStore } from '@/modules/global/composables'

const { $userFiscaliaActual } = useAppGlobalProperties()
const { mantenedor_getEstadosCausa } = useMantenedorStore()

const unidadFilter = reactive({
  first: 0,
  isLoading: false
})

const { gestionDireccionInvestigacion_getCargaTrabajoUnidad, cargaUnidad } =
  useGestionDireccionInvestigacionStore()

async function getCargaUnidad (paginacion = undefined) {
  if (!paginacion) {
    unidadFilter.first = 0
  }

  requestUtil({
    action: gestionDireccionInvestigacion_getCargaTrabajoUnidad,
    payload: {
      // OJO EN idFiscaliaDestino VA EL CODIGO (901, 912, etc) NO EL UUID DE LA FISCALIA
      codigoFiscalia: $userFiscaliaActual.value?.fiscalia,
      params: {
        page: paginacion?.page || 0,
        size: paginacion?.rows || 5
      }
    },
    loader: (loadState) => {
      unidadFilter.isLoading = loadState
    }
  })
}

onMounted(async () => {
  getCargaUnidad(cargaUnidad.value?.paginacion)
  await requestUtil({ action: mantenedor_getEstadosCausa })
})
</script>
