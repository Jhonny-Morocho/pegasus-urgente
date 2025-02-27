import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    causa: {},
    antecedentes: {},
    fiscaliaLocal: {},
    institucion: {}
  },

  actions: {
    async antecedentesCausa_getAntecedentesCausa ({ commit }, payload) {
      const { ruc } = payload
      try {
        const { data } = await apiRGP.get(`/causa/causas/antecedentes/${ruc}`)
        commit('antecedentesCausa_SET_ANTECEDENTES_CAUSA', data)
        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async antecedentesCausa_getResumenFichaCausa ({ commit }, payload) {
      const { ruc } = payload
      try {
        // const { data } = await apiRGP.get(`/causa/causas/causa/${ruc}/resumen`)
        const { data } = await apiRGP.get(`/causa/ficha-causa/${ruc}`)
        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async antecedentesCausa_getDenuncia ({ commit }, payload) {
      const { idDenuncia } = payload
      try {
        const { response } = await apiRGP.get(`ficha-causa/denuncia-causa-pam?id-denuncia=${idDenuncia}`)
        return Promise.resolve(response)
      } catch (error) {
        Promise.reject(error)
      }
    }
  },

  mutations: {
    antecedentesCausa_SET_ANTECEDENTES_CAUSA (state, data) {
      state.causa = data
      state.antecedentes = data.antecedentes
      state.fiscaliaLocal = data.fiscaliaLocal
      state.institucion = data.institucionDenunciante
    }
  }
}
