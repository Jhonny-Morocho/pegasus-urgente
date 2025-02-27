// import { apiRGP, apiBFF } from '@/config/axios'

import { apiESPECIEDINERO } from '@/config/axios'

export default {
  namespaced: true,
  dataFijacion: {},

  actions: {
    async fijacionfotografica_getDataEspecieFijacion ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`/especie-o-dinero/especie-by-rue/${payload.rue}`)
        commit('fijacionfotografica_GET_DATA_FIJACION_FOTOGRAFICA', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  mutations: {
    fijacionfotografica_GET_DATA_FIJACION_FOTOGRAFICA (state, payload) {
      state.dataFijacion = payload
    }
  }

}
