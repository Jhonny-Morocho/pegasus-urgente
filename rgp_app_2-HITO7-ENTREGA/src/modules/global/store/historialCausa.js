
export default {
  namespaced: true,

  state: {
    historialIngreso: [],
    historialPreclasificacion: [],
    historialAsignacion: [],
    historialTramitacion: [],
    historialDirigirInvestigacion: [],
    historialCausa: []
  },

  actions: {

  },

  mutations: {
    historialCausa_SET_HISTORIAL_INGRESO (state, data) {
      state.historialIngreso = data
    },
    historialCausa_SET_HISTORIAL_PRECLASIFICACION (state, data) {
      state.historialPreclasificacion = data
    },
    historialCausa_SET_HISTORIAL_ASIGNACION (state, data) {
      state.historialAsignacion = data
    },
    historialCausa_SET_HISTORIAL_TRAMITACION (state, data) {
      state.historialTramitacion = data
    },
    historialCausa_SET_HISTORIAL_DIRIGIR_INVESTIGACION (state, data) {
      state.historialDirigirInvestigacion = data
    },
    historialCausa_SET_HISTORIAL_CAUSA (state, data) {
      state.historialCausa = data
    }
  }
}
