import { useStore } from 'vuex'
import { computed } from 'vue'

export const useStepComprobanteDeInspeccionVisual = () => {
  const { state } = useStore()

  return {
    dataComprobante: computed(
      () => state.stepComprobanteDeInspeccionVisual.dataComprobante
    ),
    dataEspeciesDinero: computed(
      () => state.stepComprobanteDeInspeccionVisual.dataEspeciesDinero
    ),
    dataPersonasAsisten: computed(
      () => state.stepComprobanteDeInspeccionVisual.dataPersonasAsisten
    ),
    dataComprobanteTermino: computed(
      () => state.stepComprobanteDeInspeccionVisual.dataComprobanteTermino
    ),
    dataRegistrosInspeccion: computed(
      () => state.stepComprobanteDeInspeccionVisual.dataRegistrosInspeccion
    )
  }
}
