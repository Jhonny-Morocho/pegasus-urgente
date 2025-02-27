import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: () => ({
    detenidos: [],
    decision: null,
    paginacion: [],
    nomina: [],
    paginacionNomina: [],
    procedimientoDetenidos: [],
    paginacionProcedimientoDetenidos: [],
    procedimientoConRucs: [],
    procedimientoSinRucs: []
  }),

  actions: {
    async stepDetenidosACD_getDataTableACD ({ commit }, payload) {
      commit('stepDetenidosACD_SET_DETENIDOS', [])
      try {
        const request = await apiRGP.get(`/flagrancia/acd?page=0&size=10&id-procedimiento=${payload.idProcedimiento}&id-denuncia=${payload.idDenuncia}`)
        commit('stepDetenidosACD_SET_DETENIDOS', request.data.data)
        commit('stepDetenidosACD_SET_PAGINACION', request.data.paginacion)
        return request
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async stepDetenidosACD_registrarDecisionACD (_, payload) {
      console.log(payload)
      try {
        const request = await apiRGP.post(`/flagrancia/acd`, payload)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async stepDetenidosACD_actualizarDecisionACD (_, payload) {
      console.log(payload)
      try {
        const request = await apiRGP.put(`/flagrancia/acd`, payload)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async stepDetenidosACD_getDecisionACD (_, payload) {
      console.log(payload)
      try {
        const request = await apiRGP.get(`/flagrancia/acd/${payload.idProcedimientoDetenido}`)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async stepDetenidosACD_setEsEnviadoACD (_, payload) {
      console.log(payload)
      try {
        const request = await apiRGP.patch(`/flagrancia/acd/enviar`, payload)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async stepDetenidosACD_getNominaDetenidos ({ commit }, payload) {
      const { params } = payload
      try {
        const request = await apiRGP.get(`/flagrancia/detenido/nomina`, { params })
        commit('stepDetenidosACD_SET_NOMINA', request.data.data)
        commit('stepDetenidosACD_SET_PAGINACION_NOMINA', request.data.paginacion)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async stepDetenidosACD_getProcedimientoConDetenidos ({ commit }, payload) {
      const { params } = payload
      try {
        const request = await apiRGP.get(`/flagrancia/detenido/procedimiento`, { params })
        commit('stepDetenidosACD_SET_PROCEDIMIENTO_DETENIDOS', request.data.data)
        commit('stepDetenidosACD_SET_PAGINACION_PROCEDIMIENTO_DETENIDOS', request.data.paginacion)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepDetenidosACD_creacionRucsMasivos ({ commit }, payload) {
      try {
        const request = await apiRGP.post(`/flagrancia/detenido/nomina`, payload.data)
        commit('stepDetenidosACD_SET_PROCEDIMIENTO_CON_RUCS', request.data)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  mutations: {
    stepDetenidosACD_EDIT_DETENIDO (state, detenido) {
      const indexDetenidoAEditar = state.detenidos.findIndex(d => d.idPersona === detenido.idPersona)

      state.detenidos[indexDetenidoAEditar] = { ...state.detenidos[indexDetenidoAEditar], ...detenido }
    },

    stepDetenidosACD_SET_DETENIDOS (state, detenidos) {
      state.detenidos = detenidos
    },
    stepDetenidosACD_SET_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    },
    stepDetenidosACD_SET_DECISION (state, decision) {
      state.decision = decision
    },

    stepDetenidosACD_SET_NOMINA (state, nomina) {
      state.nomina = nomina
    },
    stepDetenidosACD_SET_PAGINACION_NOMINA (state, paginacion) {
      state.paginacionNomina = paginacion
    },

    stepDetenidosACD_SET_PROCEDIMIENTO_DETENIDOS (state, procedimientos) {
      state.procedimientoDetenidos = procedimientos
    },
    stepDetenidosACD_SET_PAGINACION_PROCEDIMIENTO_DETENIDOS (state, paginacion) {
      state.paginacionProcedimientoDetenidos = paginacion
    },
    stepDetenidosACD_SET_PROCEDIMIENTO_CON_RUCS (state, procedimientos) {
      state.procedimientoConRucs = procedimientos
    },
    stepDetenidosACD_SET_PROCEDIMIENTO_SIN_RUCS (state) {
      state.procedimientoSinRucs = state.procedimientoDetenidos?.filter(
        (procedimiento) => !procedimiento.ruc)
    },
    stepDetenidosACD_SET_DEFAULT_STATE (state) {
      state.detenidos = []
      state.decision = null
    },
    nominaDetenidos_SET_DEFAULT_STATE (state) {
      state.nomina = []
      state.paginacionNomina = null
    },
    procedimientoConRucs_SET_DEFAULT_STATE (state) {
      state.procedimientoConRucs = []
    },
    procedimientoDetenidos_SET_DEFAULT_STATE (state) {
      state.procedimientoDetenidos = []
      state.procedimientoSinRucs = []
      state.paginacionProcedimientoDetenidos = null
    }
  }
}
