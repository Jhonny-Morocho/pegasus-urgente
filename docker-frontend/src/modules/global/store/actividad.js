import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    actividades: [],
    paginacionActividades: null,
    diligenciasSugeridas: [],
    paginacionDiligenciasSugeridas: null
  },

  actions: {
    async actividad_getActividades ({ commit }, payload) {
      try {
        const { params } = payload

        const { data } = await apiRGP('/actividad/actividad/paginated', {
          params
        })

        commit('actividad_SET_ACTIVIDADES', data?.data)
        commit('actividad_SET_PAGINACION_ACTIVIDADES', data?.paginacion)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },

    async actividad_enviarSolicitud (_, payload) {
      try {
        const { solicitud } = payload

        const { data } = await apiRGP.post(
          '/actividad/actividad/solicitud',
          solicitud
        )

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },

    async actividad_deleteActividad (_, { idActividad }) {
      try {
        const { data } = await apiRGP.delete(
          `/actividad/actividad/${idActividad}`
        )

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },

    async actividad_getDiligenciasSugeridas ({ commit }, payload) {
      try {
        const { params } = payload

        const { data } = await apiRGP.get('/actividad/diligencia-sugerida/delitos', { params })

        commit('actividad_SET_DILIGENCIAS_SUGERIDAS', data)
        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },

    /* Consulta si debe ingresar directriz obligatoria segun delito */
    async actividad_getDirectrizAutomatica (_, payload) {
      try {
        const { params } = payload

        const { data } = await apiRGP.get('/actividad/delitos/directriz-automatica', { params })

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },

    async actividad_getManyActividadesByIdCausa ({ commit }, payload) {
      try {
        const { params } = payload

        const { data } = await apiRGP.post('/actividad/actividad/actividades-by-list', payload, { params })

        commit('actividad_SET_ACTIVIDADES', data)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    }
  },

  mutations: {
    actividad_SET_PAGINACION_ACTIVIDADES (state, payload) {
      state.paginacionActividades = payload
    },

    actividad_SET_ACTIVIDADES (state, payload) {
      state.actividades = payload
    },

    actividad_SET_DILIGENCIAS_SUGERIDAS (state, payload) {
      state.diligenciasSugeridas = payload.data
      state.paginacionDiligenciasSugeridas = payload.paginacion
    },

    actividad_RESET_ACTIVIDADES (state) {
      state.actividades = []
      state.paginacionActividades = null
      state.diligenciasSugeridas = []
      state.paginacionDiligenciasSugeridas = null
    }
  }
}
