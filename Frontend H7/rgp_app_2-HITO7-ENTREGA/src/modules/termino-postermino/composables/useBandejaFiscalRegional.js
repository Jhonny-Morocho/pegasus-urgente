import { computed } from 'vue'
import { useStore } from 'vuex'

export const useBandejaFiscalRegional = () => {
  const { dispatch, state } = useStore()

  return {
    causas: computed(() => state.bandejaFiscalRegional.causasBandeja),
    paginacion: computed(() => state.bandejaFiscalRegional.paginacion),

    /* ACTIONS */
    bandejaFiscalRegional_getDataBandeja: (params) => dispatch('bandejaFiscalRegional/bandejaFiscalRegional_getDataBandeja', params)

    /* MUTATIONS */
  }
}
