import { computed } from 'vue'
import { useStore } from 'vuex'

export const useBandejaFiscal = () => {
  const { dispatch, state } = useStore()

  return {
    causas: computed(() => state.bandejaFiscal.causasBandeja),
    paginacion: computed(() => state.bandejaFiscalJefe.paginacion),

    /* ACTIONS */
    bandejaFiscal_getDataBandeja: (params) => dispatch('bandejaFiscal/bandejaFiscal_getDataBandeja', params)

    /* MUTATIONS */

  }
}
