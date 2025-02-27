import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: () => ({
    tareas: [],
    paginacion: null
  }),

  actions: {
    async bandejaCustodioFiscal_getDataBandeja ({ commit }, params) {
      try {
        const baseUrl = '/bandeja/bandeja-custodio/listar'
        const response = await apiRGP.get(`${baseUrl}`, { params })
        const { data, paginacion } = response.data
        commit('bandejaCustodioFiscal_SET_ESPECIES_BANDEJA', data)
        commit('bandejaCustodioFiscal_SET_PAGINACION_BANDEJA', paginacion)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    bandejaCustodio_SET_DATA_GENERAR_CHEQUE (state, data) {
      state.dataBandejaUAF = data
    }
  }
}
