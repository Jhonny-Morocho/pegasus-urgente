export default {
  namespaced: true,

  state: {
    idDocumento: null,
    idCatalogo: null,
    dataEliminacion: {},
    dataDevolucion: null
  },

  actions: {
    async eliminarDocumentosCDD_destruirDocumentosFisico ({ commit }, payload) {
      try {
        console.log('enviar info sobre destrucción', payload)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async eliminarDocumentosCDD_devolverDocumentosFisico ({ commit }, payload) {
      try {
        console.log('enviar info sobre devolución', payload)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async eliminarDocumentosCDD_autorizar ({ commit }, payload) {
      // hacer validación usuario
      return true
    },
    async eliminarDocumentosCDD_validarCodigoBarras ({ commit }, payload) {
      // hacer validación código
      return true
    }
  },

  mutations: {
    eliminarDocumentosCDD_SET_ID_DOCUMENTO (state, id) {
      state.idDocumento = id
    },
    eliminarDocumentosCDD_SET_ID_CATALOGO (state, id) {
      state.idCatalogo = id
    },
    eliminarDocumentosCDD_SET_DATA_ELIMINACION (state, payload) {
      state.dataEliminacion = payload
    },
    eliminarDocumentosCDD_SET_DATA_DEVOLUCION (state, payload) {
      console.log('payload', payload)
      state.dataDevolucion = payload
    }
  }
}
