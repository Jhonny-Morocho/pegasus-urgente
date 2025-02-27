export default {
  namespaced: true,

  state: {
    esbtnCerrarFolio: true,
    esBackDiligencias: false
  },
  actions: {},
  mutations: {
    stepDiligencia_SET_ES_BTN_CERRARFOLIO (state, boolean) {
      state.esbtnCerrarFolio = boolean
    },
    stepDiligencia_SET_ES_BACK_DILIGENCIAS (state, boolean) {
      state.esBackDiligencias = boolean
    },
    stepDiligencia_SET_DEFAULT_STATE (state) {
      state.esbtnCerrarFolio = true
      state.esBackDiligencias = false
    }
  }
}
