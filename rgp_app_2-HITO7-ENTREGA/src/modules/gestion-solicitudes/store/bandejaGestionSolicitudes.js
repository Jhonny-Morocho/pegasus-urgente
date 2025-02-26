import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    idDenuncia: '',
    denuncias: [],
    paginacion: null
  },

  actions: {
    async bandejaGestor_getDenunciasByMultiple ({ commit }, { params }) {
      try {
        const { data } = await apiRGP.get(`/bandeja/bandeja/denuncia`, {
          params
        })
        commit('gestionSolicitudes_SET_BANDEJA', data.data)
        commit('gestionSolicitudes_SET_PAGINACION', data.paginacion)

        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    gestionSolicitudes_SET_IDDENUNCIA (state, idDenuncia) {
      state.idDenuncia = idDenuncia
    },
    gestionSolicitudes_SET_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    },
    gestionSolicitudes_SET_BANDEJA (state, data) {
      state.denuncias = data
    }
  }
}
