import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    cargaUnidad: [],
    paginacionCargaUnidad: null,
    cargaFiscal: [],
    paginacionCargaFiscal: null
  },

  actions: {
    async cargaTrabajo_getCargaUnidad ({ commit }, payload) {
      try {
        const { params, idFiscaliaDestino } = payload

        const { data } = await apiRGP.get(`/causa/asignacion/movimiento/fiscalia/unidad/codigo/${idFiscaliaDestino}`, { params })

        commit('cargaTrabajo_SET_CARGA_UNIDAD', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async cargaTrabajo_getCargaFiscal ({ commit }, payload) {
      try {
        const { codigoFiscalia, params } = payload

        const { data } = await apiRGP.get(`/causa/asignacion/movimiento/fiscalia/codigo/${codigoFiscalia}`, { params })

        commit('cargaTrabajo_SET_CARGA_FISCAL', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async cargaTrabajo_getCargaInstitucionEjecutora (_, payload) {
      try {
        const { idInstitucionEjecutora } = payload

        const { data } = await apiRGP.get(`/actividad/unidad/ejecutora/${idInstitucionEjecutora}/estadisticas`)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    cargaTrabajo_SET_CARGA_UNIDAD (state, { data, paginacion }) {
      state.cargaUnidad = data
      state.paginacionCargaUnidad = paginacion
    },

    cargaTrabajo_SET_CARGA_FISCAL (state, { data, paginacion }) {
      state.cargaFiscal = data
      state.paginacionCargaFiscal = paginacion
    },

    /* MOCK SE VA A ELIMINAR */
    cargaTrabajo_SET_CARGA_TRABAJO (state, data) {
      state.cargaTrabajo = data
    }
  }
}
