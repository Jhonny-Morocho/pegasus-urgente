import { computed } from 'vue'
import { useStore } from 'vuex'

export const useDiligenciaStore = () => {
  const { commit, dispatch, state } = useStore()

  return {
    diligenciasSugeridas: computed(() => state.diligencia.diligenciasSugeridas),

    paginacionDiligenciasSugeridas: computed(() => state.diligencia.paginacionDiligenciasSugeridas),

    diligencia_getDiligenciasSugeridas: (payload) => dispatch('diligencia/diligencia_getDiligenciasSugeridas', payload),

    diligencia_RESET_DILIGENCIAS: () => commit('diligencia/diligencia_RESET_DILIGENCIAS')
  }
}
