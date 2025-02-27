import { apiCDD, apiRGP, apiCDD2 } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    ruc: '20000001992-6',
    tipoCatalogo: [],
    nivelAcceso: [],
    disponibilidad: [],
    formatoRecepcion: [],
    claseDocumental: [],
    procedencia: [],
    nivelFirma: [],
    idiomas: [],
    causas: [],
    ubicacionEdificios: [],
    ubicacionBodegas: [],
    ubicacionEstantes: [],
    ubicacionPasillos: [],
    ubicacionCasilleros: [],
    salidas: [],
    motivosEliminacion: [],
    funcionarios: [],
    estadoDocumento: [],
    destinosDocumentosFisicos: []
  },

  actions: {
    async mantenedorCDD_getTipoCatalogo ({ commit }, payload) {
      try {
        const { data } = await apiCDD.get(`tipo-catalogo`)
        commit('mantenedorCDD_SET_TIPO_CATALOGO', data)
        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedorCDD_getNivelAcceso ({ commit }, payload) {
      try {
        const { data } = await apiCDD.get(`nivel-acceso`)
        commit('mantenedorCDD_SET_NIVEL_ACCESO', data)
        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedorCDD_getDisponibilidad ({ commit }, payload) {
      try {
        const { data } = await apiCDD.get(`disponibilidad`)
        commit('mantenedorCDD_SET_DISPONIBILIDAD', data)
        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedorCDD_getFormatoRecepcion ({ commit }, payload) {
      try {
        const { data } = await apiCDD.get(`formato-recepcion`)
        commit('mantenedorCDD_SET_FORMATO_RECEPCION', data)
        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedorCDD_getClaseDocumental ({ commit }, payload) {
      try {
        const { data } = await apiCDD.get(`clase-documental`)
        commit('mantenedorCDD_SET_CLASE_DOCUMENTAL', data)
        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedorCDD_getProcedencia ({ commit }, payload) {
      try {
        const { data } = await apiCDD.get(`procedencia`)
        commit('mantenedorCDD_SET_PROCEDENCIA', data)
        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedorCDD_getNivelFirma ({ commit }, payload) {
      try {
        const { data } = await apiCDD.get(`nivel-firma`)
        commit('mantenedorCDD_SET_NIVEL_FIRMA', data)
        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedorCDD_getIdiomas ({ commit }, payload) {
      try {
        const { data } = await apiCDD.get(`idiomas`)
        commit('mantenedorCDD_SET_IDIOMAS', data)
        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedorCDD_getTiposSalidas ({ commit }) {
      try {
        const { data } = await apiCDD.get(`tipo-salida`)
        commit('mantenedorCDD_SET_SALIDAS', data)
        console.log(data)
        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async catalogoDocumentalDigital_searchCausas ({ commit }, payload) {
      try {
        const response = await apiRGP.get(`/causa/ficha-causa/${payload.ruc}`)
        const data = response.data
        commit('catalogoDocumentalDigital_SET_CAUSAS', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedorCDD_getUbicacionEdificios ({ commit }) {
      try {
        const res = await apiCDD2.get('bodega/edificio')
        commit('mantenedorCDD_SET_UBICACION_EDIFICIOS', res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedorCDD_getUbicacionBodegas ({ commit }, payload) {
      const params = { edificioId: payload.idEdificio }
      try {
        const res = await apiCDD2.get('bodega/bodega', { params })
        commit('mantenedorCDD_SET_UBICACION_BODEGAS', res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedorCDD_getUbicacionPasillos ({ commit }, payload) {
      const params = { bodegaId: payload.idBodega }
      try {
        const res = await apiCDD2.get(`bodega/pasillo`, { params })
        commit('mantenedorCDD_SET_UBICACION_PASILLOS', res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedorCDD_getUbicacionEstantes ({ commit }, payload) {
      const params = { pasilloId: payload.idPasillo }
      try {
        const res = await apiCDD2.get('bodega/estante', { params })
        commit('mantenedorCDD_SET_UBICACION_ESTANTES', res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedorCDD_getUbicacionCasilleros ({ commit }, payload) {
      const params = { estanteId: payload.idEstante }
      try {
        const res = await apiCDD2.get('bodega/casillero', { params })
        commit('mantenedorCDD_SET_UBICACION_CASILLEROS', res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedorCDD_getMotivosEliminacion ({ commit }) {
      try {
        const response = await apiRGP.get('mantenedor/cdd/motivo-eliminacion')
        commit('mantenedorCDD_SET_MOTIVOS_ELIMINACION', response.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedorCDD_getFuncionarios ({ commit }) {
      try {
        const response = await apiRGP.get('mantenedor/cdd/funcionario')
        commit('mantenedorCDD_SET_FUNCIONARIOS', response.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedorCDD_getEstadoDocumento ({ commit }) {
      try {
        const response = await apiRGP.get('mantenedor/cdd/estado-documento')
        commit('mantenedorCDD_SET_ESTADO_DOCUMENTO', response.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedorCDD_getdestinosDocumentoFisco ({ commit }) {
      try {
        const response = await apiRGP.get(
          'mantenedor/cdd/destino-documento-fisico'
        )
        commit('mantenedorCDD_SET_DESTINOS_DOCUMENTOS_FISICOS', response.data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  mutations: {
    mantenedorCDD_SET_TIPO_CATALOGO (state, data) {
      state.tipoCatalogo = data
    },
    mantenedorCDD_SET_NIVEL_ACCESO (state, data) {
      state.nivelAcceso = data
    },
    mantenedorCDD_SET_DISPONIBILIDAD (state, data) {
      state.disponibilidad = data
    },
    mantenedorCDD_SET_FORMATO_RECEPCION (state, data) {
      state.formatoRecepcion = data
    },
    mantenedorCDD_SET_CLASE_DOCUMENTAL (state, data) {
      state.claseDocumental = data
    },
    mantenedorCDD_SET_PROCEDENCIA (state, data) {
      state.procedencia = data
    },
    mantenedorCDD_SET_NIVEL_FIRMA (state, data) {
      state.nivelFirma = data
    },
    mantenedorCDD_SET_IDIOMAS (state, data) {
      state.idiomas = data
    },
    mantenedorCDD_SET_CAUSAS_DEFAULT_STATE (state, data) {
      state.causas = []
    },
    catalogoDocumentalDigital_SET_CAUSAS (state, data) {
      state.causas = data
    },
    mantenedorCDD_SET_UBICACION_EDIFICIOS (state, data) {
      state.ubicacionEdificios = data
    },
    mantenedorCDD_SET_UBICACION_BODEGAS (state, data) {
      state.ubicacionBodegas = data
    },
    mantenedorCDD_SET_UBICACION_ESTANTES (state, data) {
      state.ubicacionEstantes = data
    },
    mantenedorCDD_SET_UBICACION_CASILLEROS (state, data) {
      state.ubicacionCasilleros = data
    },
    mantenedorCDD_SET_UBICACION_PASILLOS (state, data) {
      state.ubicacionPasillos = data
    },
    mantenedorCDD_SET_SALIDAS (state, data) {
      state.salidas = data
      console.log(state.salidas)
    },
    mantenedorCDD_SET_MOTIVOS_ELIMINACION (state, data) {
      state.motivosEliminacion = data
    },
    mantenedorCDD_SET_FUNCIONARIOS (state, data) {
      state.funcionarios = data
    },
    mantenedorCDD_SET_ESTADO_DOCUMENTO (state, data) {
      state.estadoDocumento = data
    },
    mantenedorCDD_SET_DESTINOS_DOCUMENTOS_FISICOS (state, data) {
      state.destinosDocumentosFisicos = data
      console.log(state.destinosDocumentosFisicos)
    }
  }
}
