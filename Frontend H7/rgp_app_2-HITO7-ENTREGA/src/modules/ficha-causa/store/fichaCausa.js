import { apiRGP, apiESPECIEDINERO } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    origenCausa: null,
    resumenFichaCausa: null,
    idDenuncia: null,
    causa: null,
    idCausa: null,
    ruc: null,
    dataSujetoSeleccionado: null
  },

  actions: {
    async fichaCausa_getResumenFichaCausa ({ commit }, payload) {
      try {
        const { ruc } = payload

        const { data } = await apiRGP.get(`/causa/ficha-causa/${ruc}`)

        commit('fichaCausa_SET_RESUMEN_FICHA_CAUSA', data?.causa)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async fichaCausa_getResumenCausa ({ commit }, payload) {
      const { ruc } = payload

      try {
        const { data } = await apiRGP.get(`/causa/causas/causa/${ruc}/resumen`)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async fichaCausa_recomendacionPreclasificador (_, payload) {
      try {
        const { ruc, causa } = payload

        const res = await apiRGP.put(
          `causa/causas/recomendacion-preclasificacion/${ruc}`,
          causa
        )

        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async fichaCausa_getCausa (_, payload) {
      try {
        const { idDenuncia } = payload

        const { data } = await apiRGP.get(
          `/causa/causas/denuncia/${idDenuncia}`
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async fichaCausa_obtenerCausaPorRUC ({ commit }, payload) {
      console.log(payload)
      try {
        const response = await apiESPECIEDINERO.get(
          `/especies-recepcion/ruc/?ruc=${payload.ruc}`
        )
        const data = response.data
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    fichaCausa_SET_ORIGEN_CAUSA (state, origenCausa) {
      state.origenCausa = origenCausa
    },
    fichaCausa_SET_RESUMEN_FICHA_CAUSA (state, payload) {
      state.resumenFichaCausa = payload
    },
    fichaCausa_SET_ID_DENUNCIA (state, payload) {
      state.idDenuncia = payload
    },
    fichaCausa_SET_ID_CAUSA (state, payload) {
      state.idCausa = payload
    },
    fichaCausa_SET_CAUSA (state, payload) {
      state.causa = payload
    },
    fichaCausa_SET_RUC (state, payload) {
      state.ruc = payload
    },
    fichaCausa_SET_SUJETO_SELECCIONADO (state, payload) {
      state.dataSujetoSeleccionado = payload
    }
  }
}
