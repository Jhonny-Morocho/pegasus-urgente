import { useStore } from 'vuex'
import { computed } from 'vue'

export const useBandejaCustodioUAFStore = () => {
  const { state, dispatch } = useStore()

  return {
    // STATES
    tareas: computed(() => state.bandejaCustodioFiscal.tareas),
    paginacion: computed(() => state.bandejaCustodioFiscal.paginacion),
    // ACTIONS
    bandejaCustodioFiscal_getDataBandeja: (params) => dispatch(`bandejaCustodioFiscal/bandejaCustodioFiscal_getDataBandeja`, params)
  }
}
