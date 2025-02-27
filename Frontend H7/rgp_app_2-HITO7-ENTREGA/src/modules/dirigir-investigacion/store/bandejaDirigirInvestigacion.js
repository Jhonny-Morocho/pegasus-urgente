import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    causasBandeja: [],
    paginacion: null
  },

  actions: {
    async bandejaDirigirInvestigacion_getDataBandeja ({ commit }, { params }) {
      try {
        const { data } = await apiRGP.get('/bandeja/bandeja/denuncia', { params })

        commit('bandejaDirigirInvestigacion_SET_CAUSAS_BANDEJA', data.data)
        commit('bandejaDirigirInvestigacion_SET_PAGINACION_BANDEJA', data.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async bandejaDirigirInvestigacion_togglePrioritario ({ commit }, { idBandeja, prioritario }) {
      const body = { prioritario }
      try {
        const { data } = await apiRGP.put(`/bandeja/bandeja-preclasificacion/${idBandeja}`, body)

        commit('bandejaDirigirInvestigacion_REPLACE_CAUSA_BANDEJA', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    bandejaDirigirInvestigacion_SET_CAUSAS_BANDEJA (state, payload) {
      state.causasBandeja = payload
    },
    bandejaDirigirInvestigacion_REPLACE_CAUSA_BANDEJA (state, payload) {
      state.causasBandeja = state.causasBandeja.map((causa) => causa.idBandeja === payload.idBandeja ? payload : causa)
    },
    bandejaDirigirInvestigacion_SET_PAGINACION_BANDEJA (state, payload) {
      state.paginacion = payload
    },
    bandejaDirigirInvestigacion_SET_DEFAULT_STATE (state) {
      state.causasBandeja = []
    }
  }
}
