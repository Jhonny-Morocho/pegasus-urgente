import { computed } from 'vue'
import { useStore } from 'vuex'

export const useBandejaPreclasificadorStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    causasBandeja: computed(() => state.bandejaPreclasificador.causasBandeja),
    paginacion: computed(() => state.bandejaPreclasificador.paginacion),

    // MUTATIONS
    bandejaPreclasificador_SET_DEFAULT_STATE: () =>
      commit('bandejaPreclasificador/bandejaPreclasificador_SET_DEFAULT_STATE'),

    // ACTIONS
    bandejaPreclasificador_getDataBandeja: (params) =>
      dispatch('bandejaPreclasificador/bandejaPreclasificador_getDataBandeja', params),
    bandejaPreclasificador_togglePrioritario: (payload) =>
      dispatch('bandejaPreclasificador/bandejaPreclasificador_togglePrioritario', payload)

  }
}
