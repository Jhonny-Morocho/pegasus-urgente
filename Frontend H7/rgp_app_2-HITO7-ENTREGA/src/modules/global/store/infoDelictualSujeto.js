import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    ordenesDetencion: [],
    paginacionOrdenesDetencion: null,
    medidasCautelares: [],
    paginacionMedidasCautelares: null,
    audienciasProgramadas: [],
    paginacionAudienciasProgramadas: null,
    formalizaciones: [],
    paginacionFormalizaciones: null,
    detencionesAnteriores: [],
    paginacionDetencionesAnteriores: null,
    causasAsociadas: [],
    paginacionCausasAsociadas: null,
    sentenciasAplicadas: [],
    paginacionSentenciasAplicadas: null,
    resolucionesAplicadas: [],
    paginacionResolucionesAplicadas: null
  },

  actions: {
    async infoDelictualSujeto_getOrdenesDetencion ({ commit }, payload) {
      try {
        const { numeroRut, digitoVerificador } = payload

        const { data } = await apiRGP.get(`/integracion/ordendetencion/v.1.0.0/orden-contraorden-penal/${numeroRut}/${digitoVerificador}`)

        // Modificar cuando exista paginacion
        commit('infoDelictualSujeto_SET_ORDENES_DETENCION', data)
        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response?.data)
      }
    },
    async infoDelictualSujeto_getMedidasCautelares ({ commit }, payload) {
      try {
        const { rut } = payload

        const { data } = await apiRGP.get(`/integracion/antencedente/v1.0.0/medidas-calutelares/${rut}`)

        // Modificar cuando exista paginacion
        commit('infoDelictualSujeto_SET_MEDIDAS_CAUTELARES', data)
        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response?.data)
      }
    },
    async infoDelictualSujeto_getAudienciasProgramadas ({ commit }, payload) {
      try {
        const { ruc } = payload

        const { data } = await apiRGP.get(`/integracion/audiencias-programadas/v.1.0.0/listado-notificacion/${ruc}`)

        // Modificar cuando exista paginacion
        commit('infoDelictualSujeto_SET_AUDIENCIAS_PROGRAMADAS', data)
        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response?.data)
      }
    },
    async infoDelictualSujeto_getFormalizaciones ({ commit }, payload) {
      try {
        const { numeroDocumento } = payload

        const { data } = await apiRGP.get(`/integracion/antencedente/v1.0.0/formalizaciones/${numeroDocumento}`)

        // Modificar cuando exista paginacion
        commit('infoDelictualSujeto_SET_FORMALIZACIONES', data)
        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response?.data)
      }
    },
    async infoDelictualSujeto_getDetencionesAnteriores ({ commit }, payload) {
      try {
        const { numeroDocumento } = payload

        const { data } = await apiRGP.get(`/integracion/antencedente/v1.0.0/dentenciones-anteriores/${numeroDocumento}`)

        // Modificar cuando exista paginacion
        commit('infoDelictualSujeto_SET_DETENCIONES_ANTERIORES', data)
        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response?.data)
      }
    },
    async infoDelictualSujeto_getCausasAsociadas ({ commit }, payload) {
      try {
        const { numeroDocumento } = payload

        const { data } = await apiRGP.get(`/integracion/antencedente/v1.0.0/casos/${numeroDocumento}`)

        // Modificar cuando exista paginacion
        commit('infoDelictualSujeto_SET_CAUSAS_ASOCIADAS', data)
        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response?.data)
      }
    },
    async infoDelictualSujeto_getSentenciasAplicadas ({ commit }, payload) {
      try {
        const { numeroDocumento } = payload

        const { data } = await apiRGP.get(`/integracion/antencedente/v1.0.0/sentencia-aplicada/${numeroDocumento}`)

        // Modificar cuando exista paginacion
        commit('infoDelictualSujeto_SET_SENTENCIAS_APLICADAS', data)
        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response?.data)
      }
    },
    async infoDelictualSujeto_getResolucionesAplicadas ({ commit }, payload) {
      try {
        const { numeroDocumento } = payload

        const { data } = await apiRGP.get(`/integracion/antencedente/v1.0.0/resolucion-aplicada/${numeroDocumento}`)

        // Modificar cuando exista paginacion
        commit('infoDelictualSujeto_SET_RESOLUCIONES_APLICADAS', data)
        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response?.data)
      }
    }
  },

  mutations: {
    infoDelictualSujeto_SET_ORDENES_DETENCION (state, payload) {
      state.ordenesDetencion = payload || []
    },
    infoDelictualSujeto_SET_MEDIDAS_CAUTELARES (state, payload) {
      state.medidasCautelares = payload || []
    },
    infoDelictualSujeto_SET_AUDIENCIAS_PROGRAMADAS (state, payload) {
      state.audienciasProgramadas = payload || []
    },
    infoDelictualSujeto_SET_FORMALIZACIONES (state, payload) {
      state.formalizaciones = payload || []
    },
    infoDelictualSujeto_SET_DETENCIONES_ANTERIORES (state, payload) {
      state.detencionesAnteriores = payload || []
    },
    infoDelictualSujeto_SET_CAUSAS_ASOCIADAS (state, payload) {
      state.causasAsociadas = payload || []
    },
    infoDelictualSujeto_SET_SENTENCIAS_APLICADAS (state, payload) {
      state.sentenciasAplicadas = payload || []
    },
    infoDelictualSujeto_SET_RESOLUCIONES_APLICADAS (state, payload) {
      state.resolucionesAplicadas = payload || []
    }
  }
}
