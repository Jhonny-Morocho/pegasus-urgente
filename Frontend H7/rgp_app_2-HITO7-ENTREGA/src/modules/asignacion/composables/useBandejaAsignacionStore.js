import { computed } from 'vue'
import { useStore } from 'vuex'

export const useBandejaAsignacionStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    causasBandeja: computed(() => state.bandejaAsignacion.causasBandeja),
    paginacion: computed(() => state.bandejaAsignacion.paginacion),

    // MUTATIONS
    bandejaAsignacion_SET_DEFAULT_STATE: () =>
      commit('bandejaAsignacion/bandejaAsignacion_SET_DEFAULT_STATE'),

    // ACTIONS
    bandejaAsignacion_getDataBandeja: (params) =>
      dispatch('bandejaAsignacion/bandejaAsignacion_getDataBandeja', params),

    bandejaAsignacion_togglePrioritario: (params) =>
      dispatch('bandejaAsignacion/bandejaAsignacion_togglePrioritario', params)
  }
}
