import { apiFilenet, apiCDD } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    solicitudesCatalogo: [],
    antecedentesSolicitud: null,
    versionesDocumento: [],

    ruc: '20000001992-6',
    dataCatalago: null,
    catalogo: null,
    documentos: [],
    paginacionDocumentos: null,
    documentoActualizar: {},

    paginacion: null,
    paginacionCatalogo: null,
    paginacionVersiones: null,
    taskId: null
  },

  actions: {
    // CREACION DE CATALOGO
    async creacionYGestionDeCDD_addCatalogo ({ commit }, payload) {
      console.log('post catalogo', payload)
      const data = {
        nombreCatalogo: payload.nombreCatalogo,
        saveCdd: true,
        solicitante: payload.solicitante,
        metadata: [
          {
            tipoCatalogo: payload.tipoCatalogo,
            nivelDeAcceso: payload.nivelAcceso,
            disponibilidad: payload.disponibilidad,
            descripcion: payload.descripcion
          }
        ]
      }
      const params = {
        grupo: payload.solicitante.grupo
      }
      try {
        const res = await apiCDD.post('crear-catalogo', data, { params })
        commit('creacionYGestionDeCDD_ADD_CATALOGO', res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async creacionYGestionDeCDD_getDataSolicitudes ({ commit }, payload) {
      const params = { ...payload.params }
      try {
        const res = await apiCDD.get(
          `solicitudes?id_solicitante=${payload.idSolicitante}`,
          { params }
        )
        console.log('SOLICITUDES', res.data)

        commit('creacionYGestionDeCDD_SET_SOLICITUDES', res.data.data)
        commit(
          'creacionYGestionDeCDD_SET_PAGINACION_SOLICITUDES',
          res.data.paginacion
        )
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async creacionYGestionDeCDD_getDataSolicitudById ({ commit }, payload) {
      try {
        const response = await apiCDD.get(`/solicitud/${145}`)
        commit(
          'creacionYGestionDeCDD_SET_ANTECEDENTES_SOLICITUD',
          response.data[0]
        )
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async creacionYGestionDeCDD_buscarCatalogoByNombre ({ commit }, payload) {
      const params = { ...payload.params }
      const data = {
        ...payload.payload
      }
      try {
        const res = await apiFilenet.post('consultar-documento-folder', data, { params })

        commit(
          'creacionYGestionDeCDD_SET_CATALOGO',
          res?.data?.descResult?.catalogo
        )
        commit(
          'creacionYGestionDeCDD_SET_DOCUMENTOS_POR_CATALOGO',
          res?.data?.descResult.catalogo[0].archivos
        )
        commit(
          'creacionYGestionDeCDD_SET_PAGINACION_DOCUMENTOS',
          res?.data?.descResult.catalogo[0].paginacion
        )
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async creacionYGestionDeCDD_getDocumentosPorCatalogo ({ commit }, payload) {
      console.log(payload)
      const params = {
        object_store: 'RGPOS',
        object_class: 'Actas',
        busqueda: [
          {
            Atributo: 'NombreCatalogo',
            Operador: 'EQ',
            ValorAtributo: payload.nombre_catalogo
          }
        ],
        columnas: [
          {
            id: 'id',
            claseDocumental: 'TipoClaseDocumental',
            procedencia: 'Procedencia',
            nombreArchivo: 'DocumentTitle',
            formatoRecepcion: 'FormatoRecepcionDocumento',
            fechaAgregacion: 'DateCreated',
            fechaUltActualizacion: 'DateLastModified',
            idioma: 'Idioma',
            nivelAcceso: 'NivelAcceso',
            cantidadPaginas: 'CantidadPaginas',
            requiereAlmacenamientoFisico: 'RequiereAlmacenamientoFisico',
            respaldoFisicoCustodia: 'RespaldoFisicoCustodia',
            evidencia: 'Evidencia',
            nivelFirma: 'NivelFirma',
            resumen: 'Resumen',
            version: 'MajorVersionNumber'
          }
        ]
      }
      console.log('DATA DOCUMENTOS POR CATALOGOO', params)
      try {
        const res = await apiFilenet.post('consulta-documento', params)
        commit(
          'creacionYGestionDeCDD_SET_DOCUMENTOS_POR_CATALOGO',
          res.data.data
        )
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async creacionYGestionDeCDD_getDocumentoById ({ commit }, payload) {
      const params = {
        object_store: 'RGPOS',
        id: payload.id
      }
      const documento = await apiFilenet.post(`/obtenerDocumentoById`, params)
      console.log('Documento Obtenido', documento.data)
      commit(
        'creacionYGestionDeCDD_SET_DOCUMENTO_A_ACTUALIZAR',
        documento.data
      )
      return documento.data
    },
    async creacionYGestionDeCDD_getHistorialVersionesDocumento (
      { commit },
      payload
    ) {
      console.log(payload)
      const params = { ...payload.params }
      console.log(params)
      try {
        const res = await apiCDD.get(`buscar-versiones/${payload.id}`, {
          params
        })
        console.log('Versiones del documento', res.data.data)
        console.log('paginacion del documento', res.data.paginacion)
        commit('creacionYGestionDeCDD_SET_VERSIONES_DOCUMENTO', res.data.data)
        commit(
          'creacionYGestionDeCDD_SET_PAGINCION_VERSIONES_DOCUMENTO',
          res.data.paginacion
        )
      } catch (error) {}
    },

    // GESTION DE DOCUMENTOS
    async creacionYGestionDeCDD_addDocumento ({ commit }, payload) {
      console.log(payload)
      console.log(payload.fileBase64)
      const params = {
        object_store: 'RGPOS',
        clase_documental: 'Actas',
        titulo_documento: payload.nombreArchivo,
        contenido_documento: payload.fileBase64,
        mime_type: payload.mime_type,
        metadata: [
          {
            TipoClaseDocumental: '1',
            CodigoCatalogo: payload.id,
            FormatoRecepcionDocumento: payload.formato,
            Procedencia: payload.procedencia,
            NivelAcceso: payload.nivelAcceso,
            NivelFirma: payload.nivelFirma,
            Disponibilidad: payload.consultas,
            Evidencia: payload.esEvidencia,
            Resumen: payload.resumen,
            CantidadPaginas: payload.cantidadPaginas,
            RespaldoFisicoCustodia: payload.respaldoCustodia,
            RequiereAlmacenamientoFisico: payload.almacenamientoFisico,
            NombreCatalogo: payload.nombre_catalogo,
            Idioma: payload.idioma
          }
        ],
        save_cdd: true,
        nombre_catalogo: payload.nombre_catalogo
      }
      try {
        console.log('params', params)
        const req = await apiFilenet.post(`subir-documento`, params)
        console.log(req.data)
        commit('creacionYGestionDeCDD_ADD_DOCUMENTO', req.data)
        return req.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async creacionYGestionDeCDD_deleteDocumento ({ _commit }, payload) {
      try {
        const req = await apiFilenet.delete(
          `/documento/antecedentes-documentos/${payload.idDocumentoAsociacion}`
        )
        return req.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async creacionYGestionDeCDD_updateDocumento ({ _commit }, payload) {
      console.log('payload', payload)
      try {
        await apiFilenet.post(`/modificar-documento`, payload)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    // CREACION DE CATALOGO
    creacionYGestionDeCDD_ADD_CATALOGO (state, data) {
      state.dataCatalogo = data
    },
    creacionYGestionDeCDD_SET_CATALOGO (state, data) {
      state.catalogo = data
    },
    creacionYGestionDeCDD_SET_DOCUMENTOS_POR_CATALOGO (state, data) {
      state.documentos = data
    },
    creacionYGestionDeCDD_SET_PAGINACION_DOCUMENTOS (state, paginacion) {
      state.paginacionDocumentos = paginacion
    },
    creacionYGestionDeCDD_SET_DOCUMENTOS_DEFAULT_STATE (state) {
      state.documentos = []
    },
    creacionYGestionDeCDD_SET_SOLICITUDES (state, payload) {
      state.solicitudesCatalogo = payload
    },
    creacionYGestionDeCDD_SET_PAGINACION_SOLICITUDES (state, payload) {
      console.log(payload)
      state.paginacionCatalogo = payload
    },
    creacionYGestionDeCDD_SET_VERSIONES_DOCUMENTO (state, versionesDoc) {
      state.versionesDocumento = versionesDoc
    },
    creacionYGestionDeCDD_SET_PAGINCION_VERSIONES_DOCUMENTO (state, paginacion) {
      state.paginacionVersiones = paginacion
      console.log('paginacion', paginacion)
    },

    // GESTION DE DOCUMENTOS
    creacionYGestionDeCDD_ADD_DOCUMENTO (state, data) {
      state.documentos.push(data)
    },
    creacionYGestionDeCDD_DELETE_DOCUMENTO (state, idDocumento) {
      state.documentos = state.documentos.filter(
        (doc) => doc.idArchivo !== idDocumento
      )
      return Promise.resolve()
    },
    creacionYGestionDeCDD_SET_DOCUMENTO_A_ACTUALIZAR (state, payload) {
      state.documentoActualizar = payload
      console.log(state.documentoActualizar)
    },
    creacionYGestionDeCDD_SET_DOCUMENTOS (state, documentos) {
      state.documentos = documentos
    },
    creacionYGestionDeCDD_SET_DEFAULT_STATE (state) {
      state.documentos = []
      state.catalogo = null
      state.solicitudesCatalogo = []
      state.dataCatalago = null
      state.paginacion = null
      state.paginacionCatalogo = null
      state.antecedentesSolicitud = null
    },
    // ANTECEDENTES DOCUMENTO
    creacionYGestionDeCDD_SET_ANTECEDENTES_SOLICITUD (state, data) {
      state.antecedentesSolicitud = data
    },
    creacionYGestionDeCDD_SET_TASK_ID (state, data) {
      state.taskId = data
    }
  }
}
