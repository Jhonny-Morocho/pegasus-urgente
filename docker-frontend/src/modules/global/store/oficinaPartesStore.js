/* eslint-disable no-unreachable */
import { apiRGP } from '@/config/axios/'
import { cleanParts } from '@fiquu/cl-rut'

export default {
  namespaced: true,

  state: () => ({
    identificadorUnicoDenuncia: '32467545572',
    paginacion: null,
    registroParte: {
      detalles: []
    },
    actasDocumentosAdjuntos: [],
    partes: [],
    dataParteDenuncia: {},
    plantilla: null,
    solicitudesDocFaltantes: [],
    idsDocsSolicitar: [],
    parteSeleccionado: {},
    partesBandeja: []
  }),

  mutations: {
    oficinaPartes_LIMPIAR_PARTES (state) {
      state.partes = []
      state.actasDocumentosAdjuntos = []
      state.registroParte = {
        fechaRecepcionDenuncia: new Date(),
        numeroDeReferencia: '',
        tipoInterviniente: '',
        rutDeQuienEntrega: '',
        nombreDeQuienEntrega: '',
        cargoQuienEntrega: '',
        unidadPolicial: '',
        prefecturaDependencia: '',
        unidadEspecializada: '',
        nombreInstitucion: '',
        nombreContactoInstitucion: '',
        correoElectronicoInstitucion: '',
        telefonoInstitucion: '',
        rutPersonaNatural: '',
        nombrePersonaNatural: '',
        correoPersonaNatural: '',
        telefonoPersonaNatural: ''
      }
    },
    oficinaPartes_LIMPIAR_DOCUMENTOS (state) {
      state.actasDocumentosAdjuntos = []
    },
    oficinaPartes_GET_ID_UNICO_DENUNCIA (state, id) {
      state.identificadorUnicoDenuncia = id
    },
    oficinaPartes_REGISTRAR_PARTE (state, registroParte) {
      state.registroParte = registroParte
    },

    oficinaPartes_AGREGAR_DOCUMENTO (state, documento) {
      documento.idDocumento = new Date().toISOString()
      state.actasDocumentosAdjuntos.push(documento)
    },

    oficinaPartes_ELIMINAR_DOCUMENTO (state, doc) {
      state.actasDocumentosAdjuntos = state.actasDocumentosAdjuntos.filter((documentoAEliminar) => documentoAEliminar.idDocumento !== doc.idDocumento)
    },

    oficinaPartes_EDITAR_DOCUMENTO (state, doc) {
      state.actasDocumentosAdjuntos = state.actasDocumentosAdjuntos.map((d) => (d.idDocumento === doc.idDocumento ? doc : d))
    },

    oficinaPartes_AGREGAR_PARTE (state, parte) {
      parte.documentos = state.actasDocumentosAdjuntos
      parte.idParte = new Date().toISOString()
      state.partes.push(parte)
      state.actasDocumentosAdjuntos = []
    },

    oficinaPartes_ELIMINAR_PARTE_DENUNCIA (state, idParte) {
      state.partes = state.partes.filter((parteAEliminar) => parteAEliminar.idParte !== idParte.value)
    },

    oficinaPartes_GET_BANDEJA_SOLICITUD_DOC_FALTANTE (state, partesBandeja) {
      state.partesBandeja = partesBandeja
    },

    oficinaPartes_EDITAR_PARTE (state, parte) {
      parte.documentos = state.actasDocumentosAdjuntos
      state.partes = state.partes.map((p) => (p.idParte === parte.idParte ? parte : p))
    },

    oficinaPartes_EDITAR_PARTE_ADD_DOCUMENTOS (state, parte) {
      state.actasDocumentosAdjuntos = parte.documentos
    },

    oficinaPartes_ADD_PARTE_DENUNCIA (state, parte) {
      state.registroParte = parte
    },
    oficinaPartes_ADD_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    },

    oficinaPartes_ADD_DENUNCIA (state, denuncia) {
      state.dataParteDenuncia = denuncia
    },

    oficinaPartes_SET_PLANTILLA (state, payload) {
      state.plantilla = {}
      state.plantilla = payload.plantilla
    },

    // oficinaPartes_GUARDAR_SOLICITUD_DOC_FALTANTES (state, payload) {
    //   state.solicitudesDocFaltantes = payload
    // },

    oficinaPartes_SET_PARTE_SELECCIONADO (state, payload) {
      state.parteSeleccionado = payload
    },

    oficinaPartes_SET_ES_DOCUMENTO_SOLICITADO (state, documentosSeleccionados) {
      documentosSeleccionados.value.forEach((unDocumentoPayload) => {
        state.dataParteDenuncia.detalles[0].documentos.forEach((documento) => {
          if (documento.idDocumento === unDocumentoPayload.idDocumento) {
            documento.esDocumentoFaltante = false
            documento.esDocumentoSolicitado = true
          }
        })
      })
    },

    oficinaPartes_AGREGAR_DOCUMENTACION_PLANTILLA (state, payload) {
      state.dataParteDenuncia.detalles[0].observaciones = payload.observaciones
      state.dataParteDenuncia.detalles[0].solicitudDocFaltantes = payload.solicitudDocFaltantes
    },

    oficinaPartes_SET_IDS_SOLICITUD_DOCUMENTOS (state, ids) {
      state.idsDocsSolicitar = ids
    },

    oficinaPartes_SET_SOLICITUD (state) {
      state.parteSeleccionado.dataParteDenuncia.detalles[0].documentos.forEach(d => {
        if (state.idsDocsSolicitar.includes(d.idDocumento)) {
          d.esDocumentoFaltante = false
          d.esDocumentoSolicitado = true
        }
      })
      console.log(state.parteSeleccionado)
    }
  },

  actions: {
    oficinaPartes_getIdUnicoDenuncia ({ commit }, id) {
      commit('oficinaPartes_GET_ID_UNICO_DENUNCIA', id) // primer click
    },

    oficinaPartes_registrarParte ({ commit }, registroParte) {
      commit('oficinaPartes_REGISTRAR_PARTE', registroParte)
    },

    oficinaPartes_agregarDocumento ({ commit }, documento) {
      commit('oficinaPartes_AGREGAR_DOCUMENTO', documento) //
    },

    oficinaPartes_agregarParte ({ commit }, parte) {
      commit('oficinaPartes_AGREGAR_PARTE', parte)
    },
    oficinaPartes_addParteDenuncia ({ commit, state }) {
      const parteDenuncia = state.registroParte
      parteDenuncia.detalles = state.partes
      commit('oficinaPartes_ADD_PARTE_DENUNCIA', parteDenuncia)
    },

    async oficinaPartes_addDenuncia ({ commit, state }, usuario) {
      const data = {}
      data.usuario = usuario
      data.dataParteDenuncia = state.registroParte
      data.dataParteDenuncia.siglaIdentificadorUnicoDenuncia = 'P' // se debe cambiar cuando generen este dato en el mantenedor

      // refactorizar después
      const rutDeQuienEntrega = cleanParts(data.dataParteDenuncia.rutDeQuienEntrega)
      const rutPersonaNatural = cleanParts(data.dataParteDenuncia.rutPersonaNatural)

      if (rutDeQuienEntrega) {
        data.dataParteDenuncia.rutDeQuienEntrega = `${rutDeQuienEntrega[0]}-${rutDeQuienEntrega[1]}`
      } else if (rutPersonaNatural) {
        data.dataParteDenuncia.rutPersonaNatural = `${rutPersonaNatural[0]}-${rutPersonaNatural[1]}`
      }

      try {
        const res = await apiRGP.post('denuncia/partes-denuncias/', data)
        console.log(res.data)
        commit('oficinaPartes_ADD_DENUNCIA', res.data)
      } catch (error) {
        return Promise.reject(error.response.data)
      }
    },

    async oficinaPartes_getPropuestaPlantilla ({ commit }, payload) {
      console.log('para plantilla: ', payload)
      try {
        const res = await apiRGP.post('/denuncia/plantilla/solicitud-documentacion-faltante', payload)
        console.log(res)
        commit('oficinaPartes_SET_PLANTILLA', res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async oficinaPartes_guardarSolicitudDocumentosFaltantes ({ commit, state }, usuario) {
      commit('oficinaPartes_SET_SOLICITUD')
      console.log(state.parteSeleccionado.dataParteDenuncia)
      const payload = {}
      payload.dataParteDenuncia = state.parteSeleccionado.dataParteDenuncia
      payload.usuario = usuario
      payload.procesoPam = {
        taskInstanceId: state.parteSeleccionado.procesoPam.taskId,
        processInstanceId: state.parteSeleccionado.procesoPam.taskProcessInstanceId,
        idDenuncia: state.parteSeleccionado.dataParteDenuncia.idDenuncia,
        idCausa: state.parteSeleccionado.dataParteDenuncia.idCausa
      }
      return apiRGP.put('/denuncia/partes-denuncias/', payload).then((res) => {
        commit('oficinaPartes_GUARDAR_SOLICITUD_DOC_FALTANTES', res.data)
        return res.data
      })
    },

    async oficinaPartes_getBandejaSolicitudDocFaltante ({ commit }, params) {
      try {
        const res = await apiRGP.get(`/bandeja/bandeja/denuncia`, { ...params })

        commit('oficinaPartes_ADD_PAGINACION', res.data.paginacion)
        commit('oficinaPartes_GET_BANDEJA_SOLICITUD_DOC_FALTANTE', res.data.data)
        return res
      } catch (error) {
        console.error('oficinaPartesStore', error)
      }
    },

    async oficinaPartes_getPartesDenunciaById ({ commit }, data) {
      try {
        const response = await apiRGP.get(
          `denuncia/partes-denuncias/${data.data.denuncia.idDenuncia}`
        )

        const parte = {}
        parte.dataParteDenuncia = response.data
        parte.dataParteDenuncia.idCausa = data.data.denuncia.idCausa
        parte.procesoPam = data.tarea
        commit('oficinaPartes_SET_PARTE_SELECCIONADO', parte)
        return parte
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
