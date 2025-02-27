import { apiESPECIEDINERO } from '@/config/axios'
// import { verCadenaCustodia } from '@/data/EYD/dataConsultaPorNue.json'

export default {
  namespaced: true,

  state: () => ({
    cadenaMock: null,
    cadenaEncontradaAsociadaANue: [],
    evidencias: [],
    eslabones: [],
    observaciones: [],
    idCustodiaEvidencia: null

  }),

  actions: {
    async verCadenaCustodio_getDataCadenaCustodia ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`cadena-custodia/${payload.nue}`)
        console.log('DATA DE NUE', data)
        commit('verCadenaCustodio_SET_CADENA_ENCONTRADA', data)
        commit('verCadenaCustodio_SET_CADENA_EVIDENCIA_ENCONTRADA', data.especiesODineros)

        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async cadenaCustodio_agregarObservacion ({ commit }, payload) {
      try {
        const response = await apiESPECIEDINERO.post(`/custodia-observaciones/agregar-observacion`, payload)
        const data = response.data
        // commit('levantamientoCadenaCustodio_ADD_EVIDENCIA', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async cadenaCustodio_getEslabonesCadenaCustodia ({ commit }, payload) {
      const { data } = await apiESPECIEDINERO.get(`custodia-eslabones/eslabones/${payload.idCadenaCustodia}`)
      commit('verCadenaCustodio_GET_ESLABONES', data)
      return data
    },
    async cadenaCustodio_getObservacionesCadenaCustodia ({ commit }, payload) {
      const { data } = await apiESPECIEDINERO.get(`custodia-observaciones/observaciones/${payload.idCadenaCustodia}`)
      commit('verCadenaCustodio_GET_OBSERVACIONES', data)
      return data
    }
  },

  mutations: {

    // DESCOMENTAR CUANDO HAYA ENDPOINT DE CONSULTA POR NUE
    verCadenaCustodio_SET_CADENA_ENCONTRADA (state, cadenaEncontrada) {
      state.cadenaEncontradaAsociadaANue = cadenaEncontrada
      state.idCustodiaEvidencia = cadenaEncontrada.especiesODineros.idCustodiaEvidencia
      console.log('Causa encontrada seteada en store: ', state.cadenaEncontradaAsociadaANue)
    },
    verCadenaCustodio_SET_CADENA_EVIDENCIA_ENCONTRADA (state, cadenaEncontrada) {
      state.evidencias = cadenaEncontrada
      console.log('EVIDENCIA: ', state.evidencias)
    },
    verCadenaCustodio_RESET_CAUSA_ENCONTRADA (state) {
      state.causaEncontradaAsociadaANue = []
    },
    verCadenaCustodio_GET_ESLABONES (state, data) {
      state.eslabones = data
      console.log('ESLABONES: ', state.eslabones)
    },
    verCadenaCustodio_GET_OBSERVACIONES (state, data) {
      state.observaciones = data
      console.log('OBSERVACIONES: ', state.observaciones)
    }
  }
}
