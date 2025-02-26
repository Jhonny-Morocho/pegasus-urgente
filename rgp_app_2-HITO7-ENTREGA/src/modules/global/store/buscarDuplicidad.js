import { apiRGP } from '@/config/axios/'
export default {
  namespaced: true,

  state: () => ({
    candidatasDuplicidad: [],
    dataPam: {},
    seDenegoDuplicidad: false,
    paginacion: null
  }),

  actions: {
    async buscarDuplicidad_buscarDuplicidad ({ commit }, params) {
      console.log('params :>> ', params)
      try {
        const response = await apiRGP.get(
          '/causaduplicada/causas-duplicadas', { params }
        )
        const { data, paginacion } = response.data
        commit('buscarDuplicidad_BUSCAR_DUPLICIDAD', data ?? [])
        commit('buscarDuplicidad_ADD_PAGINACION', paginacion)

        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async buscarDuplicidad_decisionCausaDuplicada ({ commit }, payload) {
      payload.dataCausaDuplicada.codTipoDenuncia = 1
      try {
        let url = '/causa/decisiones-causas-duplicadas/directa'
        if (payload.url) {
          url += payload.url
        }
        const response = await apiRGP.post(`${url}`, payload)
        const data = response.data

        commit('buscarDuplicidad_SET_DATA_PAM', data)

        return data
      } catch (error) {
        console.log(error)
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    buscarDuplicidad_BUSCAR_DUPLICIDAD (state, data) {
      state.candidatasDuplicidad = data
    },
    buscarDuplicidad_ADD_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    },
    buscarDuplicidad_SET_DATA_PAM (state, data) {
      state.dataPam = data
      state.seDenegoDuplicidad = true
    },
    buscarDuplicidad_RESET (state) {
      state.seDenegoDuplicidad = false
      state.candidatasDuplicidad = []
    }
  }
}
