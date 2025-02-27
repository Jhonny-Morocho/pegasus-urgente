import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    documentos: [],
    sujetoVictimaVIFDescriptions: [],
    sujetoVictimaNnaDescriptions: [],
    sujetoVictimaDeclaracionDescriptions: []
  },

  actions: {
    async stepDocumentos_addDocumento ({ commit }, payload) {
      return apiRGP
        .post('/documento/antecedentes-documentos/', payload)
        .then((res) => {
          commit('stepDocumentos_ADD_DOCUMENTO', res.data)
          commit('stepDocumentos_ADD_DESCRIPTION', res.data)
        })
    }
  },

  mutations: {
    stepDocumentos_ADD_DOCUMENTO (state, data) {
      state.documentos.push(data)
    },
    stepDocumentos_ADD_DESCRIPTION (state, data) {
      switch (data.idDocumento.relacionFront) {
        case 'sujetoVictimaVIF':
          state.sujetoVictimaVIFDescriptions.push(data.idDocumento.descripcion)
          break

        case 'sujetoVictimaNNA':
          state.sujetoVictimaNnaDescriptions.push(data.idDocumento.descripcion)
          break

        case 'sujetoVictimaDeclaracion':
          state.sujetoVictimaDeclaracionDescriptions.push(
            data.idDocumento.descripcion
          )
          break

        default:
          break
      }
    },
    stepDocumentos_REMOVE_ONE_DOCUMENTO (state, idDocumento) {
      state.documentos = state.documentos.filter(
        (doc) => doc.id !== idDocumento
      )
    },
    stepDocumentos_SET_DOCUMENTOS (state, documentos) {
      state.documentos = documentos
    },
    stepDocumentos_SET_DEFAULT_STATE (state) {
      state.documentos = []
    }
  }
}
