<template>
<AppFieldset legend="Distribución de Carga de Trabajo por Fiscal">
  <TablaCargaFiscal
    v-model:first="fiscalFilter.firstRecord"
    :loading="fiscalFilter.isLoading"
    :rows="cargaFiscal?.paginacion?.tamanoPagina"
    :total-records="cargaFiscal?.paginacion?.elementosTotales"
    :value="cargaFiscal?.data"
    @page="getCargaFiscal"
  />
</AppFieldset>
</template>
<script setup>
import TablaCargaFiscal from '@/modules/termino-postermino/components/ver-carga-trabajo/TablaCargaFiscal.vue'
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import { requestUtil } from '@/utils'
import { onMounted, reactive } from 'vue-demi'
import { useAppGlobalProperties } from '@/modules/common/composables'
import { useGestionDireccionInvestigacionStore } from '../../composables'
import { useMantenedorStore } from '@/modules/global/composables'

const { $userFiscaliaActual } = useAppGlobalProperties()
const { mantenedor_getEstadosCausa } = useMantenedorStore()

const fiscalFilter = reactive({
  first: 0,
  isLoading: false
})

const { gestionDireccionInvestigacion_getCargaTrabajoFiscal, cargaFiscal } =
  useGestionDireccionInvestigacionStore()

async function getCargaFiscal (pagination = undefined) {
  if (!pagination) {
    fiscalFilter.first = 0
  }
  console.log('fiscalia', $userFiscaliaActual.value?.fiscalia)
  requestUtil({
    action: gestionDireccionInvestigacion_getCargaTrabajoFiscal,
    payload: {
      // OJO EN idFiscaliaDestino VA EL CODIGO (901, 912, etc) NO EL UUID DE LA FISCALIA
      codigoFiscalia: $userFiscaliaActual.value?.fiscalia,
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    loader: (loadState) => {
      fiscalFilter.isLoading = loadState
    }
  })
}

onMounted(async () => {
  getCargaFiscal(cargaFiscal.value?.paginacion)
  await requestUtil({ action: mantenedor_getEstadosCausa })
})
</script>
