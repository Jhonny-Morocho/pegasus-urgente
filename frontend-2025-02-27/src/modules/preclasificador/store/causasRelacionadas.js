import { apiBFF, apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    causasRelacionadas: [],
    causasRelacionadasGuardadas: [],
    paginacionCausasRelacionadas: null
  },

  actions: {
    async causasRelacionadas_getCausasRelacionadas ({ commit }, payload) {
      try {
        const { idCausa } = payload

        const { data } = await apiRGP.get(`/causaduplicada/causas-relacionadas/${idCausa}`)

        commit('causasRelacionadas_SET_CAUSAS_RELACIONADAS', data?.data)
        commit('causasRelacionadas_SET_PAGINACION_CAUSAS_RELACIONADAS', data?.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async causasRelacionadas_postCausasRelacionadas ({ _ }, payload) {
      try {
        const { data } = await apiRGP.post(`/causaduplicada/causas-relacionadas/`, payload)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // #region bff BFF se debe eliminar
    async causasRelacionadas_buscarCausasRelacionadas ({ commit }, payload) {
      try {
        const { params } = payload

        const { data } = await apiBFF.get(`/bff/modulo-antecedente/causa`, { params })

        commit('causasRelacionadas_SET_CAUSAS_RELACIONADAS', data?.data)
        commit('causasRelacionadas_SET_PAGINACION_CAUSAS_RELACIONADAS', data?.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async causasRelacionadas_relacionarCausas ({ dispatch }, payload) {
      try {
        const { causas, ruc } = payload
        console.log('🚀 ~ file: causasRelacionadas.js ~ line 46 ~ causasRelacionadas_relacionarCausas ~ causas', causas)

        const response = await apiBFF.post(`/bff/modulo-antecedente/causa/${ruc}/relacion`, causas)

        dispatch('causasRelacionadas_getCausasRelacionadas', { ruc: ruc })

        return Promise.resolve(response)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async causasRelacionadas_deleteCausaRelacionada ({ _ }, payload) {
      const { ruc, rucRelacionada } = payload

      try {
        const { data } = await apiBFF.delete(`/bff/modulo-antecedente/causa/${ruc}/relacion/${rucRelacionada}`)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    }
    // #endregion bff
  },

  mutations: {
    causasRelacionadas_SET_CAUSAS_RELACIONADAS (state, causas) {
      state.causasRelacionadas = causas
    },

    causasRelacionadas_SET_CAUSAS_RELACIONADAS_GUARDADAS (state, causas) {
      state.causasRelacionadasGuardadas = causas
    },

    causasRelacionadas_DEL_CAUSAS_RELACIONADAS_GUARDADAS (state) {
      state.causasRelacionadasGuardadas = []
    },

    causasRelacionadas_SET_PAGINACION_CAUSAS_RELACIONADAS (state, paginacion) {
      state.paginacionCausasRelacionadas = paginacion
    }
  }
}
