import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    paginacion: null,
    anotaciones: []
  },

  actions: {
    async anotacionCausa_getAnotacionesByIdDenuncia ({ commit }, payload) {
      try {
        const { idDenuncia, params } = payload

        const { data } = await apiRGP.get(`/causa/anotaciones/denuncia/${idDenuncia}`, { params })

        commit('anotacionCausa_SET_ANOTACIONES', data.data)
        commit('anotacionCausa_SET_PAGINACION_ANOTACIONES', data.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async anotacionCausa_getAnotacionById (_, payload) {
      try {
        const { idAnotacion } = payload

        const { data } = await apiRGP.get(`/causa/anotaciones/${idAnotacion}`)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async anotacionCausa_crearAnotacion (_, payload) {
      try {
        const { anotacion } = payload

        const { data } = await apiRGP.post('/causa/anotaciones', anotacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async anotacionCausa_modificarAnotacion (_, payload) {
      try {
        const { idAnotacion, anotacion } = payload

        const { data } = await apiRGP.put(`/causa/anotaciones/${idAnotacion}`, anotacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async anotacionCausa_eliminarAnotacion (_, payload) {
      try {
        const { idAnotacion } = payload

        const { data } = await apiRGP.delete(`/causa/anotaciones/${idAnotacion}`)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    anotacionCausa_SET_ANOTACIONES (state, payload) {
      state.anotaciones = payload
    },
    anotacionCausa_SET_PAGINACION_ANOTACIONES (state, payload) {
      state.paginacion = payload
    }
  }
}
