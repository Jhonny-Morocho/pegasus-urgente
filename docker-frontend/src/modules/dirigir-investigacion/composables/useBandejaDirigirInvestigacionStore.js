import { computed } from 'vue'
import { useStore } from 'vuex'

export const useBandejaDirigirInvestigacionStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    causasBandeja: computed(() => state.bandejaDirigirInvestigacion.causasBandeja),
    paginacion: computed(() => state.bandejaDirigirInvestigacion.paginacion),

    // MUTATIONS
    bandejaDirigirInvestigacion_SET_DEFAULT_STATE: () =>
      commit('bandejaDirigirInvestigacion/bandejaDirigirInvestigacion_SET_DEFAULT_STATE'),

    // ACTIONS
    bandejaDirigirInvestigacion_getDataBandeja: (params) =>
      dispatch('bandejaDirigirInvestigacion/bandejaDirigirInvestigacion_getDataBandeja', params),
    bandejaDirigirInvestigacion_togglePrioritario: (payload) =>
      dispatch('bandejaDirigirInvestigacion/bandejaDirigirInvestigacion_togglePrioritario', payload)
  }
}
