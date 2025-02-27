import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    causasBandeja: [],
    paginacion: null
  },

  actions: {
    async bandejaAsignacion_getDataBandeja ({ commit }, { params }) {
      try {
        const { data } = await apiRGP.get(`/bandeja/bandeja/denuncia`, { params })
        commit('bandejaAsignacion_SET_CAUSAS_BANDEJA', data.data)
        commit('bandejaAsignacion_SET_PAGINACION_BANDEJA', data.paginacion)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async bandejaAsignacion_togglePrioritario ({ commit }, { idBandeja, prioritario }) {
      const body = { prioritario }
      try {
        const { data } = await apiRGP.put(`/bandeja/bandeja-preclasificacion/${idBandeja}`, body)

        commit('bandejaAsignacion_REPLACE_CAUSA_BANDEJA', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    bandejaAsignacion_SET_CAUSAS_BANDEJA (state, payload) {
      state.causasBandeja = payload
    },
    bandejaAsignacion_SET_PAGINACION_BANDEJA (state, payload) {
      state.paginacion = payload
    },
    bandejaAsignacion_REPLACE_CAUSA_BANDEJA (state, payload) {
      state.causasBandeja = state.causasBandeja.map((causa) => causa.idBandeja === payload.idBandeja ? payload : causa)
    },
    bandejaAsignacion_SET_DEFAULT_STATE (state) {
      state.causasBandeja = []
    }
  }
}
