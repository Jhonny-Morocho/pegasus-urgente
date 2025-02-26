import { apiFilenet, apiCDD } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    // GET DATA BANDEJA FISCAL
    tareasFiscal: [],
    paginacionBandejaFiscal: null,

    // SOLICITUD DE ANALISIS DE ACTUALIZACION
    solicitudActualizacion: [],
    antecedentesSolicitud: [],
    antecedentesCatalogo: [],
    antecedentesCatalogoPaginacion: [],
    datosActualizados: [],
    documentoSolicitud: null,
    paginacionDocumentoSolicitud: null,
    taskId: null,

    // DOCUMENTOS
    dataListDocumentos: [],
    paginacion: null
  },

  actions: {
    // GET DATA BANDEJA FISCAL
    async solicitudesFiscalCDD_getDataBandejaFiscal ({ commit }, payload) {
      const params = payload.params
      try {
        const res = await apiCDD.get('pam/bandeja-fiscal', { params })
        commit('solicitudesFiscalCDD_SET_TAREAS_BANDEJA_FISCAL', res.data.data)
        commit('solicitudesFiscalCDD_SET_PAGINACION_BANDEJA_FISCAL', res.data.paginacion)
      } catch (error) {}
    },

    // CREACION SOLICITUD ACTUALIZACIÓN DOCUMENTO
    async solicitudesFiscalCDD_solicitudSubirOActualizarDocumento ({ _commit }, payload) {
      console.log(payload)
      try {
        const res = await apiCDD.post(`solicitud-archivo/`, payload)
        return Promise.resolve(res)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // SOLICITUD DE ANAILISIS DE ACTUALIZACION
    async solicitudesFiscalCDD_getSolicitudActualizacionById ({ commit }, payload) {
      console.log(payload)
      try {
        const response = await apiCDD.get(`/solicitud-archivo/${payload.idSolicitud}`)
        commit('solicitudesFiscalCDD_SET_ANTECEDENTES_SOLICITUD', response.data)
        commit('solicitudesFiscalCDD_SET_TASK_ID', payload.taskId)
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async solicitudesFiscalCDD_getAntecedentesCatalogo ({ commit }, payload) {
      const result = { id: '58' }
      try {
        const { data } = await apiFilenet.get('catalogo/' + result.id)
        commit('solicitudActualizacion_SET_ANTECEDENTES_DOCUMENTOS', data.result[0])
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async solicitudesFiscalCDD_aprobarSolicitudActualizacion ({ _commit }, payload) {
      try {
        await apiCDD.put(`solicitud-archivo/${payload.id}`, payload.params)
      } catch (error) {
        Promise.reject(error)
      }
    },

    // SOLICITUD PARA RECUPERAR DOCUMENTO FISICO
    async solicitudesFiscalCDD_solicitudRecuperacionDocumentoFisico ({ _commit }, payload) {
      try {
        const data = await apiCDD.post('solicitud-recuperacion-archivo', payload)
        return data
      } catch (error) {
        Promise.reject(error)
      }
    },

    // OBTENCION SOLICITUD DE RECUPERACION DE DOCUMENTO FISICO PARA ANALISIS
    async solicitudesFiscalCDD_getSolicitudAnalisisRecuperacionDocuFisicoById ({ commit }, payload) {
      console.log(payload)
      try {
        const response = await apiCDD.get(`/solicitud-recuperacion-archivo/${payload.idSolicitud}`)
        commit('solicitudesFiscalCDD_SET_ANTECEDENTES_SOLICITUD', response.data)
        commit('solicitudesFiscalCDD_SET_TASK_ID', payload.taskId)
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // APROBAR ANALISIS DE SOLICITUD DE RECUPERACION DE DOCUMENTO FISICO
    async solicitudesFiscalCDD_aprobarSolicitudRecuperacionDocuFisico ({ _commit }, payload) {
      try {
        const response = await apiCDD.put(`analizar-solicitud-recuperacion-archivo/${payload.idSolicitud}`, payload.params)
        return Promise.resolve(response)
      } catch (error) {
        Promise.reject(error)
      }
    },

    // OBTENCION DE SOLICITUD PARA REVISION DE SOLICITUD DE ALMACENAMIENTO FISICO
    async solicitudesFiscalCDD_getSolicitudRevisionAlmacenamientoFisico ({ commit }, payload) {
      console.log(payload)
      const id = payload.idSolicitud
      try {
        const response = await apiCDD.get(`/solicitud-archivo/${id}`)
        const dataCatalogo = {
          catalogo: { ...response.data.catalogo },
          solicitante: { ...response.data.solicitante },
          idSolicitud: response.data.solicitud.id,
          archivo: response.data.archivo
        }
        console.log(response)
        commit('solicitudesFiscalCDD_SET_ANTECEDENTES_SOLICITUD', dataCatalogo)
        commit('solicitudesFiscalCDD_SET_TASK_ID', payload.taskId)
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // APROBAR O RECHAZAR SOLICITUD DE ALMACENAMIENTO FISICO
    async solicitudesFiscalCDD_aprueboRechazoSolicitudAlmacenamientoFisico ({ _commit }, payload) {
      try {
        const response = await apiCDD.post(`/procesar-solicitud-catalogo-documental`, payload)
        console.log(response)

        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // SOLICITUD DE ELIMINACION DE DOCUMENTO FISICO
    async solicitudesFiscalCDD_solicitudEliminacionArchivo ({ _commit }, payload) {
      try {
        console.log(payload)
        const response = await apiCDD.post(`/solicitud-eliminacion-archivo`, payload)
        return Promise.resolve(response)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async solicitudesFiscalCDD_getSolicitudEliminacionArchivo ({ commit }, payload) {
      try {
        console.log(payload)
        const response = await apiCDD.get(`/solicitud-eliminacion-archivo/${payload.idSolicitud}`)
        commit('solicitudActualizacion_SET_DATOS_ANTECEDENTES', response.data)
        commit('solicitudesFiscalCDD_SET_TASK_ID', payload.taskId)
        return Promise.resolve(response)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async solicitudesFiscalCDD_aprobarSolicitudRevisionEliminacionArchivo ({ _commit }, payload) {
      console.log(payload)
      try {
        console.log(payload)
        const response = await apiCDD.put(`/revisar-solicitud-eliminacion-archivo/${payload.id}`, payload.data)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    //  GET DATA BANDEJA FISCAL
    solicitudesFiscalCDD_SET_TAREAS_BANDEJA_FISCAL (state, data) {
      state.tareasFiscal = data
    },
    solicitudesFiscalCDD_SET_PAGINACION_BANDEJA_FISCAL (state, data) {
      state.paginacionBandejaFiscal = data
    },

    // SOLICITUD
    solicitudesFiscalCDD_SET_ANTECEDENTES_SOLICITUD (state, data) {
      console.log(data.archivo.paginacion)
      state.solicitud = data
      state.antecedentesSolicitud = data
      state.documentoSolicitud = [data.archivo.data]
      state.paginacionDocumentoSolicitud = data.archivo.paginacion
      console.log(state.paginacionDocumentoSolicitud)
    },
    solicitudesFiscalCDD_SET_TASK_ID (state, data) {
      console.log(data)
      state.taskId = data
      console.log(state.taskId)
    },
    solicitudActualizacion_SET_ANTECEDENTES_DOCUMENTOS (state, data) {
      state.antecedentesCatalogo = data
    },
    solicitudActualizacion_SET_DATOS_ANTECEDENTES (state, data) {
      state.antecedentesSolicitud = data
    },

    // DOCUMENTOS
    solicitudGestionDocumentosCDD_SET_DEFAULT_STATE (state) {
      state.dataListDocumentos = []
    },
    solicitudGestionDocumentosCDD_SET_DATA_DOCUMENTOS (state, data) {
      state.dataListDocumentos = data
    },
    solicitudGestionDocumentosCDD_SET_PAGINACION_DOCUMENTOS (state, payload) {
      state.paginacion = payload
    }
  }
}
