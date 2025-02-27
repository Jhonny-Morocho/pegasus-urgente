import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: () => ({
    direccion: [],
    direcciones: [],
    paginacion: null
  }),

  getters: {},

  actions: {
    async direccion_getDirecciones ({ commit }, { idPersona, params }) {
      try {
        const res = await apiRGP.get(
          `/persona/persona/${idPersona}/direccion`,
          { params }
        )
        commit('direccion_SET_DIRECCIONES', res.data.data)
        commit('direccion_SET_PAGINACION', res.data.paginacion)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async direccion_addDireccion ({ _ }, payload) {
      try {
        const res = await apiRGP.post('/persona/persona/direccion/', payload)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async direccion_getDireccion ({ commit }, { idDireccion, idContactoDueno }) {
      try {
        const res = await apiRGP.get(
          `/persona/persona/direccion/${idContactoDueno}/${idDireccion}`
        )
        commit('direccion_SET_DIRECCION', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async direccion_deleteDireccion ({ _ }, { idDireccion, idContactoDueno }) {
      try {
        const res = await apiRGP.delete(
          `persona/persona/direccion/${idContactoDueno}/${idDireccion}`
        )
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async direccion_putActualizarDireccion ({ _ }, payload) {
      try {
        const res = await apiRGP.put(`persona/persona/direccion`, payload)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async direccion_getDireccionOrganismoColaborador (_, payload) {
      try {
        const { idOrganismoColaborador } = payload

        const { data } = await apiRGP.get(`/direccion/direccion/v1.0.0/organismo-colaborador/${idOrganismoColaborador}`)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    direccion_SET_DIRECCIONES (state, direcciones) {
      state.direcciones = direcciones
    },
    direccion_SET_DIRECCION (state, direccion) {
      state.direccion = direccion
    },
    direccion_SET_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    }
  }
}
