import { apiESPECIEDINERO } from '@/config/axios'

export default {
  namespaced: true,
  state: () => ({
    dataRue: {},
    getEtiquetaReubicacion: {}
  }),
  actions: {
    async stepBusquedaAgregarSepararEspecies_busquedaPorRue ({ commit, state }, payload) {
      console.log('data ubicacion ', payload)
      try {
        commit('stepBusquedaAgregarSepararEspecies_SET_DATA_RUE', payload)
        return payload
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepBusquedaAgregarSepararEspecies_getEtiqueta ({ commit, state }, payload) {
      console.log('data ubicacion ', payload)
      try {
        commit('stepBusquedaAgregarSepararEspecies_GET_ETIQUETA', payload)
        return payload
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepBusquedaAgregarSepararEspecies_reubicarEspecie ({ _commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.put(`especie-o-dinero/reubicar-especies`, payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  mutations: {
    stepBusquedaAgregarSepararEspecies_SET_DATA_RUE (state, payload) {
      state.dataRue = {
        dataCausa: payload.causa,
        especie: payload.especie
      }
    },
    stepBusquedaAgregarSepararEspecies_GET_ETIQUETA (state, payload) {
      state.getEtiquetaReubicacion = payload
    }
  }
}
