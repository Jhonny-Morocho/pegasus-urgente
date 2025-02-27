import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    fiscaliasCompetentes: []
  },

  actions: {
    async georreferencia_getFiscaliaPorCompetenciaTerritorial(_, payload) {
      try {
        const { direccion, comuna, region } = payload

        const body = {
          apiKey: 'AIzaSyDC6_n-6Y8lACv7LZ2YAbHFghlVbQGLQdA',
          direccionDelito: direccion,
          comunaDelito: comuna,
          regionDelito: region
        }

        // VA EN EL MS DE FISCALIA Y NO GENERAL
        const { data } = await apiRGP.post(
          '/general/georreferencia/fiscalia-por-competencia-territorial',
          body
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async georreferencia_getFiscaliaCompetenciaTerritorialByIdDenuncia(_, payload) {
      try {
        const { idDenuncia } = payload

        const { data } = await apiRGP.get(`/general/fiscalia/competencia-territorial/detalle/${idDenuncia}`)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async georreferencia_postGuardarFiscaliaCompetenciaTerritorial(_, payload) {
      try {
        const { data } = await apiRGP.post(`/general/fiscalia/competencia-territorial/`, payload)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    georreferencia_SET_FISCALIAS_COMPETENTES(state, data) {
      state.fiscaliasCompetentes = data
    },

    georreferencia_RESET_FISCALIAS_COMPETENTES(state) {
      state.fiscaliasCompetentes = []
    }
  }
}
