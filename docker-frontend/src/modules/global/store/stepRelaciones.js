
export default {
  namespaced: true,

  state: () => ({
    relaciones: []
  }),

  mutations: {
    stepRelaciones_DELETE_ONE_RELACION (state, index) {
      state.relaciones.splice(index, 1)
    },
    /*  stepRelaciones_EDIT_RELACION (state, payload) {
      state.relaciones.forEach(relacion => {
        if (relacion.idRelacion === payload.idRelacion) {
          Object.assign(relacion, payload)
        }
      })
    }, */
    stepRelaciones_SET_RELACIONES (state, relaciones) {
      state.relaciones = relaciones
    },

    stepRelaciones_SET_DEFAULT_STATE (state) {
      state.relaciones = []
    }
  }
}
