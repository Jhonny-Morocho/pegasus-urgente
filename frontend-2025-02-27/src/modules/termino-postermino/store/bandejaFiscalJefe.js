import { apiRGP } from '@/config/axios/'
export default {
  namespaced: true,

  state: () => ({
    causasBandeja: [],
    paginacion: null
  }),

  actions: {
    async bandejaFiscalJefe_getDataBandeja ({ commit }, { params }) {
      // CAMBIAR POR LO COMENTADO CUANDO BACKEND SESAQUE UN EDNPOINT
      try {
        const { data } = await apiRGP.get('/bandeja/bandeja/denuncia', { params })

        commit('bandejaFiscalJefe_SET_CAUSAS_BANDEJA', data.data)
        commit('bandejaFiscalJefe_SET_PAGINACION_BANDEJA', data.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    bandejaFiscalJefe_SET_CAUSAS_BANDEJA (state, data) {
      state.causasBandeja = data
    },
    bandejaFiscalJefe_SET_PAGINACION_BANDEJA (state, data) {
      state.paginacion = data
    },
    bandejaFiscalJefe_SET_DEFAULT_STATE (state) {
      state.causasBandeja = []
    }
  }
}
