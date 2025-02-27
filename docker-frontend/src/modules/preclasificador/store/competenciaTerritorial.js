import { apiBFF } from '@/config/axios'
import { Promise } from 'core-js'

export default {
  namespaced: true,

  state: {
    fiscaliasCompetentes: [],
    listaGeorreferenciaDelitos: [],
    delitosGeorreferenciados: []
  },

  actions: {
    async competenciaTerritorial_getListaGeorreferenciaDelitos ({ commit }, payload) {
      try {
        const { ruc } = payload

        const { data } = await apiBFF.get(`/bff/modulo-delito/causa/${ruc}/delito/georreferencia`)

        commit('competenciaTerritorial_SET_LISTA_GEORREFERENCIA_DELITOS', data)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },

    async competenciaTerritorial_consultarCompetenciaTerritorial ({ commit }, payload) {
      try {
        const { idDelito, delito } = payload

        const { data } = await apiBFF.post('/bff/modulo-fiscalia/obtener-fiscalia-competente-a-territorio', payload)

        commit('competenciaTerritorial_ADD_FISCALIA_COMPETENTE', { idDelito, delito, ...data })

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },

    async competenciaTerritorial_guardarGeorrenferenciacion (_, payload) {
      try {
        const { georreferencias } = payload

        const response = await apiBFF.patch('/bff/modulo-delito/delito/fiscalia', georreferencias)

        return Promise.resolve(response)
      } catch (error) {
        Promise.reject(error)
      }
    },

    async competenciaTerritorial_getDelitosGeorreferenciados ({ commit }, payload) {
      try {
        const { ruc } = payload

        const { data } = await apiBFF.get(`/bff/modulo-delito/causa/${ruc}/delito/georreferencia/resultado`)

        commit('competenciaTerritorial_SET_DELITOS_GEORREFERENCIADOS', data)
        Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    }
  },

  mutations: {
    competenciaTerritorial_SET_LISTA_GEORREFERENCIA_DELITOS (state, data) {
      state.listaGeorreferenciaDelitos = data
    },

    competenciaTerritorial_SET_DELITOS_GEORREFERENCIADOS (state, data) {
      state.delitosGeorreferenciados = data
    },

    competenciaTerritorial_ADD_FISCALIA_COMPETENTE (state, data) {
      state.fiscaliasCompetentes.push(data)
    }
  },

  getters: {
    competenciaTerritorial_getGeorreferenciaDelito: (state) => (idDelito) => {
      return state.listaGeorreferenciaDelitos.find((d) => d.idDelito === idDelito)
    },
    competenciaTerritorial_getCompetenciaDelito: (state) => (idDelito) => {
      return state.fiscaliasCompetentes.find((fiscalia) => fiscalia.idDelito === idDelito)
    }
  }
}
