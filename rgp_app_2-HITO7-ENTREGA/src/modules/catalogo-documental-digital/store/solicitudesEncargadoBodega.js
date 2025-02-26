import { apiCDD } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    // DATA BANDEJA
    tareasEncargadoBodega: [],
    paginacionBandejaBodega: null,
    antecedentesSolicitud: null,
    taskId: null,
    solicitud: null,
    documentoReingreso: null,
    paginaciondocumento: null,
    catalogoSolicitud: null,
    registroDevolucion: null,
    documentoAgendamiento: null,
    idSolicitud: null,
    intervineintesRegistroDestruccion: null,
    intervineintesRegistroDevolucion: null

  },

  actions: {
    // GET DATA BANDEJA ENCARGADO BODEGA
    async solicitudesEncargadoBodega_getDataBandeja ({ commit }, payload) {
      const params = payload.params
      try {
        const res = await apiCDD.get('pam/bandeja-encargado-bodega', { params })

        commit('solicitudesEncargadoBodega_SET_TAREAS_BANDEJA', res.data.data)
        commit('solicitudesEncargadoBodega_SET_PAGINACION_BANDEJA', res.data.paginacion)
      } catch (error) {}
    },

    // INGRESO A BODEGA
    // Obtener solicitud de ingreso de documento fisico a bodega
    async solicitudesEncargadoBodega_getSolicitudRegistroIngresoDocuFisico ({ commit }, payload) {
      try {
        const response = await apiCDD.get(`/solicitud-archivo/${payload.id}`)
        commit('solicitudesEncargadoBodega__SET_ANTECEDENTES_SOLICITANTE', response.data)
        commit('solicitudesEncargadoBodega__SET_TASK_ID', payload.taskId)
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // Enviar registro de ingreso de docuemnto fisicio a bodega
    async solicitudesEncargadoBodega_enviarRegistroDeIngresoABodega ({ _commit }, payload) {
      try {
        const response = await apiCDD.put(`/registro-documento-fisico-bodega/${payload.id}`, payload)

        return Promise.resolve(response.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // Enviar registro de ingreso de docuemnto fisicio a bodega temporal
    async solicitudesEncargadoBodega_enviarRegistroABodegaTemporal ({ _commit }, payload) {
      console.log(payload)
      try {
        const response = await apiCDD.put(`/registro-documento-fisico-bodega-temporal/${payload.id}`, payload
        )

        return Promise.resolve(response.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // RECUPERACION DE DOCUMENTO FISICO
    // Obtener solicitud de recuperacion de documento fisico para revision y para generar registro de salida
    async solicitudesEncargadoBodega_getSolicitudRecuperacionDocuFisico ({ commit }, payload) {
      try {
        const response = await apiCDD.get(`/solicitud-recuperacion-archivo/${payload.id}`)

        commit('solicitudesEncargadoBodega__SET_ANTECEDENTES_SOLICITANTE', response.data)
        commit('solicitudesEncargadoBodega__SET_TASK_ID', payload.taskId)

        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // Envio de revision de solicitud de recuperación de documento fisicio
    async solicitudesEncargadoBodega_enviarAnalisisSolicitudRecuperacionArchivo ({ commit }, payload) {
      try {
        const response = await apiCDD.put(`/revisar-solicitud-recuperacion-archivo/${payload.id}`, payload)
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // REGISTRO DE SALIDA
    // Generar Registro de salida documentos fisico
    async solicitudesEncargadoBodega_generarRegistroDesalidaDocufisico ({ commit }, payload) {
      try {
        const response = await apiCDD.put(`/registrar-salida-documento/${payload.id}`, payload)
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // REGISTRO DE REINGRESO
    // obtencion de data del documento para reingreso
    async solicitudesEncargadoBodega_getSolicitudParaReingreso ({ commit }, payload) {
      try {
        const response = await apiCDD.get(`/recuperacion-archivo/${payload.codigoBarras}`, payload)
        commit('solicitudesEncargadoBodega__SET_DOCUMENTO_A_REINGRESAR', response.data.archivo.data)
        commit('solicitudesEncargadoBodega__SET_PAGINACION_DOCUMENTO', response.data.archivo.paginacion)
        commit('solicitudesEncargadoBodega__SET_ANTECEDENTES_SOLICITANTE', response.data.solicitante)
        commit('solicitudesEncargadoBodega__SET_DATA_CATALOGO_SOLICITUD', response.data.catalogo)
        commit('solicitudesEncargadoBodega__SET_REGISTRO_DEVOLUCION', response.data.recuperacionArchivo)
        commit('solicitudesEncargadoBodega__SET_SOLICITUD', response.data)
        return Promise.resolve(response.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // Generar Registro de Reingreso de documento fisico
    async solicitudesEncargadoBodega_generarRegistroReingresoDocufisico ({ commit }, payload) {
      try {
        const res = await apiCDD.put(`/reingreso-documento/${payload.id}`, payload.payload)
        Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // AGENDAMIENTO PARA DEVOLUCION DE DOCUMENTO FISICIO
    // Obtencion de solicitud para Agendamiento, destruccion y devolucion de documento fisico
    async solicitudesEncargadoBodega_getSolicitudAgendamiento ({ commit }, payload) {
      try {
        const { data } = await apiCDD.get(`/solicitud-eliminacion-archivo-idarchivo/${payload.idFilenet}`, payload)
        console.log(data)

        commit('solicitudesEncargadoBodega__SET_DEFAULT_STATE')
        commit('solicitudesEncargadoBodega__SET_TASK_ID', payload.taskId)
        commit('solicitudesEncargadoBodega__SET_ID_SOLICITUD', payload.idSolicitud)
        commit('solicitudesEncargadoBodega__SET_SOLICITUD', data.solicitud)
        commit('solicitudesEncargadoBodega__SET_ANTECEDENTES_SOLICITANTE', data.solicitante)
        commit('solicitudesEncargadoBodega__SET_DATA_CATALOGO_SOLICITUD', data.catalogo)
        commit('solicitudesEncargadoBodega__SET_DOCUMENTO_A_AGENDAR', data.archivos.data[0])
        commit('solicitudesEncargadoBodega__SET_PAGINACION_DOCUMENTO', data.archivos.paginacion)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // Generar Agendamiento para documento fisico
    async solicitudesEncargadoBodega_generarAgendamientoParaDocumentoFisico ({ _commit }, payload) {
      console.log(payload)
      try {
        const res = await apiCDD.put(`/agendar-devolucion-documento/${payload.idSolicitud}`, payload)
        Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // DEVOLUCION O DESTRUCCION DE DOCUMENTO FISICO
    // Generar Registro de Devolucion de Documento Físico
    async solicitudesEncargadoBodega_generarRegistroDeDestruccion ({ _commit }, payload) {
      console.log(payload)
      try {
        const res = await apiCDD.put(`/registro-destruccion-documento-fisico/${payload.idArchivo}`, payload)
        Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // Generar Registro de Destrucción de documento fisico
    async solicitudesEncargadoBodega_generarRegistroDevolucion ({ _commit }, payload) {
      console.log(payload)
      try {
        const res = await apiCDD.put(`/registro-devolucion-documento-fisico/${payload.idArchivo}`, payload)
        Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    //  GET DATA BANDEJA
    solicitudesEncargadoBodega_SET_TAREAS_BANDEJA (state, data) {
      state.tareasEncargadoBodega = data
    },
    solicitudesEncargadoBodega_SET_PAGINACION_BANDEJA (state, data) {
      state.paginacionBandejaBodega = data
    },

    // Solicitud Reingreso
    solicitudesEncargadoBodega__SET_DOCUMENTO_A_REINGRESAR (state, data) {
      state.documentoReingreso = data
    },

    solicitudesEncargadoBodega__SET_REGISTRO_DEVOLUCION (state, data) {
      state.registroDevolucion = data
    },

    // Agendamiento documento fisicio
    solicitudesEncargadoBodega__SET_DOCUMENTO_A_AGENDAR (state, data) {
      state.documentoAgendamiento = data
    },

    // Registro de detruccion
    solicitudesEncargadoBodega__SET_DATA_MINISTRO_FE_Y_QUIEN_DESTRUYE (state, data) {
      state.intervineintesRegistroDestruccion = data
    },
    solicitudesEncargadoBodega__SET_DATA_INTERVINIENTE_DEVOLUCION (state, data) {
      state.intervineintesRegistroDevolucion = data
    },

    // Mutaciones globales
    solicitudesEncargadoBodega__SET_TASK_ID (state, data) {
      state.taskId = data
    },
    solicitudesEncargadoBodega__SET_ID_SOLICITUD (state, data) {
      state.idSolicitud = data
    },
    solicitudesEncargadoBodega__SET_SOLICITUD (state, data) {
      state.solicitud = data
    },
    solicitudesEncargadoBodega__SET_ANTECEDENTES_SOLICITANTE (state, data) {
      state.antecedentesSolicitud = data
    },
    solicitudesEncargadoBodega__SET_DATA_CATALOGO_SOLICITUD (state, data) {
      state.catalogoSolicitud = data
    },
    solicitudesEncargadoBodega__SET_PAGINACION_DOCUMENTO (state, data) {
      state.paginaciondocumento = data
    },
    solicitudesEncargadoBodega__SET_DEFAULT_STATE (state) {
      state.tareasEncargadoBodega = []
      state.paginacionBandejaBodega = null
      state.antecedentesSolicitud = null
      state.taskId = null
      state.solicitud = null
      state.documentoReingreso = null
      state.paginaciondocumento = null
      state.catalogoSolicitud = null
      state.registroDevolucion = null
      state.documentoAgendamiento = null
    }
  }
}
