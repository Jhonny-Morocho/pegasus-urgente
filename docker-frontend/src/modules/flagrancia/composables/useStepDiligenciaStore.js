/* eslint-disable no-unused-vars */
import { computed } from 'vue'
import { useStore } from 'vuex'

export const useStepDiligenciaStore = () => {
  const { state, commit } = useStore()

  return {
    // #region STATE
    esbtnCerrarFolio: computed(() => state.stepDiligencia.esbtnCerrarFolio),
    esBackDiligencias: computed(() => state.stepDiligencia.esBackDiligencias),

    // #endregion

    // #region ACTIONS
    // #endregion

    // #region MUTATIONS
    stepDiligencia_SET_ES_BTN_CERRARFOLIO: (boolean) =>
      commit('stepDiligencia/stepDiligencia_SET_ES_BTN_CERRARFOLIO', boolean),

    stepDiligencia_SET_ES_BACK_DILIGENCIAS: (boolean) =>
      commit('stepDiligencia/stepDiligencia_SET_ES_BACK_DILIGENCIAS', boolean),

    stepDiligencia_SET_DEFAULT_STATE: () =>
      commit('stepDiligencia/stepDiligencia_SET_DEFAULT_STATE')
    // #endregion
  }
}
