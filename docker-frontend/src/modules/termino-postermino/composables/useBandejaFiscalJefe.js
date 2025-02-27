import { computed } from 'vue'
import { useStore } from 'vuex'

export const useBandejaFiscalJefe = () => {
  const { dispatch, state } = useStore()

  return {
    causas: computed(() => state.bandejaFiscalJefe.causasBandeja),
    paginacion: computed(() => state.bandejaFiscalJefe.paginacion),

    /* ACTIONS */
    bandejaFiscalJefe_getDataBandeja: (params) => dispatch('bandejaFiscalJefe/bandejaFiscalJefe_getDataBandeja', params)

    /* MUTATIONS */

  }
}
