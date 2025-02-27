/* eslint-disable no-unused-vars */
import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    diligenciasSugeridas: [],
    paginacionDiligenciasSugeridas: null
  },

  actions: {
    async diligencia_getDiligenciasSugeridas ({ commit }, payload) {
      try {
        const { delitos } = payload
        const { data } = await apiRGP.post('/bandeja/diligencias-prioritarias/', delitos)

        commit('diligencia_SET_DILIGENCIAS_SUGERIDAS', data)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response?.data)
      }
    }
  },

  mutations: {
    diligencia_SET_DILIGENCIAS_SUGERIDAS (state, payload) {
      state.diligenciasSugeridas = payload?.filter(diligencia => diligencia.codigoDiligencia !== '0')
    },
    diligencia_RESET_DILIGENCIAS (state) {
      state.diligenciasSugeridas = []
      state.paginacionDiligenciasSugeridas = null
    }
  }
}
