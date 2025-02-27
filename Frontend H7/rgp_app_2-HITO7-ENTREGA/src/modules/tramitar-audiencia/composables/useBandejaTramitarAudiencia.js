import { computed } from 'vue'
import { useStore } from 'vuex'

export const useBandejaTramitarAudiencia = () => {
  const { dispatch, state } = useStore()

  return {
    tareasBandeja: computed(() => state.bandejaTramitarAudiencia.tareasBandeja),
    paginacion: computed(() => state.bandejaTramitarAudiencia.paginacion),

    /* ACTIONS */
    bandejaTramitarAudiencia_getDataBandeja: (params) => dispatch('bandejaTramitarAudiencia/bandejaTramitarAudiencia_getDataBandeja', params)

    /* MUTATIONS */
  }
}
