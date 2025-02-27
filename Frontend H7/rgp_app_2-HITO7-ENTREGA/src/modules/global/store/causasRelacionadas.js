import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    causasRelacionadas: [],
    paginacion: null
  },

  actions: {
    async causasRelacionadas_consultarCausasRelacionadas (_, payload) {
      try {
        const { params } = payload

        const { data } = await apiRGP.get(`/causaduplicada/causas-relacionadas`, { params })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.resolve(error)
      }
    },
    async causasRelacionadas_consultarCausasRelacionadasSaf (_, payload) {
      try {
        const { params } = payload

        const { data } = await apiRGP.get(`/integracion/busqueda/v1.0.0/casos-relacionados`, { params })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.resolve(error)
      }
    },
    async causasRelacionadas_guardarCausasRelacionadas (_, payload) {
      try {
        const { causasRelacionadas } = payload

        const { data } = await apiRGP.post(`/causaduplicada/causas-relacionadas`, causasRelacionadas)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.resolve(error)
      }
    },
    async causasRelacionadas_getCausasRelacionadas ({ commit }, payload) {
      try {
        const { idCausa, params } = payload

        const { data } = await apiRGP.get(`/causaduplicada/causas-relacionadas/${idCausa}`, { params })

        commit('causasRelacionadas_SET_CAUSAS_RELACIONADAS', data?.data)
        commit('causasRelacionadas_SET_PAGINACION', data?.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.resolve(error)
      }
    },
    async causasRelacionadas_eliminarCausasRelacionadas (_, payload) {
      try {
        const params = `?idCausaPadre=${payload.idCausaPadre}&idsCausasHijas=${payload.idsCausasHijas}`

        const response = await apiRGP.delete(`/causaduplicada/causas-relacionadas/causa-relaciones${params}`)

        return Promise.resolve(response)
      } catch (error) {
        return Promise.resolve(error)
      }
    }
  },

  mutations: {
    causasRelacionadas_SET_CAUSAS_RELACIONADAS (state, data) {
      state.causasRelacionadas = data
    },
    causasRelacionadas_SET_PAGINACION (state, data) {
      state.paginacion = data
    },
    causasRelacionadas_SET_DEFAULT_STATE (state) {
      state.causasRelacionadas = []
      state.paginacion = null
    }
  }
}
