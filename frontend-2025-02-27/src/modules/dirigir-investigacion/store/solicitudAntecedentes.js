import { apiBFF } from '@/config/axios'
import axios from 'axios'

// DISCLAIMER: A PESAR DE ESTAR EN PRECLASIFICADOR, SE UTILIZA EN H5 y H6
export default {
  namespaced: true,

  state: {
    antecedentesEspecificos: [],
    origenesAntecedentes: [],
    antecedentesSolicitados: [],
    paginacionAntecedentesSolicitados: null
  },

  actions: {
    async solicitudAntecedentes_getAntecedentesEspecificos ({ commit }, _payload) {
      try {
        const { data } = await axios.get('/preclasificadorAPI/step7.json')

        commit('solicitudAntecedentes_SET_ANTECEDENTES_ESPECIFICOS', data.antecedentesEspecificos)
        commit('solicitudAntecedentes_SET_ORIGEN_ANTECEDENTES', data.origenes)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },

    async solicitudAntecedentes_getAntecedentesSolicitados ({ commit }, payload) {
      try {
        const { ruc, params } = payload

        const { data } = await apiBFF.get(`/bff/modulo-documento/causa/${ruc}/antecedentes/solicitud`, { params })

        commit('solicitudAntecedentes_SET_ANTECEDENTES_SOLICITADOS', data.data)
        commit('solicitudAntecedentes_SET_PAGINACION_ANTECEDENTES_SOLICITADOS', data.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },

    async solicitudAntecedentes_solicitarAntecedenteEspecifico (_, payload) {
      try {
        const { ruc, antecedente } = payload

        const response = await apiBFF.post(`/bff/modulo-documento/causa/${ruc}/antecedentes/solicitud`, antecedente)

        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    solicitudAntecedentes_SET_ANTECEDENTES_ESPECIFICOS (state, data) {
      state.antecedentesEspecificos = data
    },

    solicitudAntecedentes_SET_ORIGEN_ANTECEDENTES (state, data) {
      state.origenesAntecedentes = data
    },

    solicitudAntecedentes_SET_ANTECEDENTES_SOLICITADOS (state, data) {
      state.antecedentesSolicitados = data
    },

    solicitudAntecedentes_SET_PAGINACION_ANTECEDENTES_SOLICITADOS (state, data) {
      state.paginacionAntecedentesSolicitados = data
    }
  }
}
