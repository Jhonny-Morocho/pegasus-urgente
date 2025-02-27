import { apiRGP } from '@/config/axios'
export default {
  namespaced: true,

  state: {
    denuncias: [],
    paginacion: null
  },

  actions: {
    async bandejaDenunciaOficio_getDenunciasByMultiple ({ commit }, { params }) {
      try {
        const { data } = await apiRGP.get(`/bandeja/bandeja/denuncia`, { params })

        commit('bandejaDenunciaOficio_SET_DENUNCIAS', data.data)
        commit('bandejaDenunciaOficio_SET_PAGINACION', data.paginacion)

        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    bandejaDenunciaOficio_SET_DENUNCIAS (state, payload) {
      state.denuncias = payload
    },

    bandejaDenunciaOficio_SET_PAGINACION (state, paginacion) {
      state.paginacion = paginacion

      console.log(state, paginacion)
    }
  }
}
