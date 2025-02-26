import { apiESPECIEDINERO } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    historialSolicitudNues: [],
    paginacion: {},
    listadoSolicitudNues: []
  },
  getters: {
    getStoreEvidencias (state) {
      const { evidencias } = state

      return {
        evidencias
      }
    }
  },
  actions: {
    levantamientoCadena_addEvidencia ({ commit }, payload) {
      const data = payload
      console.log('dataevidencia', data)
      commit('levantamientoCadenaCustodio_ADD_EVIDENCIA', data)
    },
    async solicitudAsignacionNue_addSolicitudAsignacionNue ({ _commit }, payload) {
      console.log('paylod response post', payload)
      try {
        const response = await apiESPECIEDINERO.post('/nue-asignada/solicitud-nue', payload)
        const data = response.data
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async solicitudAsignacionNue_getHistorialSolicitudNues ({ commit }, payload) {
      console.log('aca')
      const { data } = await apiESPECIEDINERO.get(`nue-asignada/find-nue-organismo/${payload.idOrganismo}`)
      const paginacion = {
        paginaActual: payload.page,
        elementosTotales: data.length,
        paginasTotales: Math.ceil(data.length / payload.rows),
        tamanoPagina: payload.rows
      }
      commit('solicitudAsignacionNue_GET_HISTORIAL_SOLICITUD_NUES', data, paginacion)
      return data
    },
    async solicitudAsignacionNue_getListadoSolicitudNuesQR ({ commit }, payload) {
      const { data } = await apiESPECIEDINERO.get(`nue-asignada/find-nue-qr/${payload.idNueAsignada}/${payload.idOrganismo}`)
      commit('solicitudAsignacionNue_GET_HISTORIAL_SOLICITUD_NUES', data)
      return data
    },

    // GET PARA OBTENER DESCARGA DE ZIP CON NUES QR,FALTA CAMBIAR URL ENDPONT Y COMMIT
    async solicitudAsignacionNue_getDescargaZipNues ({ commit }, payload) {
      const { data } = await apiESPECIEDINERO.get(`nue-asignada/download-nue-qr/${payload.idNueAsignada}/${payload.idOrganismo}`)
      // commit('solicitudAsignacionNue_GET_HISTORIAL_SOLICITUD_NUES', data)
      return data
    }
  },
  mutations: {
    levantamientoCadenaCustodio_SET_NUE_ENCONTRADO (state, data) {
      state.nue = data
      console.log('Nue encontrada seteada en store: ', state.nue)
    },
    levantamientoCadenaCustodio_ADD_EVIDENCIA (state, data) {
      console.log('data add', data)
      state.evidencias.push(data)
    },
    levantamientoCadenaCustodio_ADD_LEVANTAMIENTO_CADENA (state, data) {
      console.log('data add Levantamiento', data)
      state.cadenaLevantamiento.push(data)
    },
    solicitudAsignacionNue_GET_HISTORIAL_SOLICITUD_NUES (state, data, paginacion) {
      console.log('data del gistorial', data)
      state.historialSolicitudNues = data
      state.paginacion = paginacion
    },
    solicitudAsignacionNue_GET_Listado_SOLICITUD_NUES_QR (state, data) {
      console.log('data del listadoQR', data)
      state.listadoSolicitudNues = data
    }
  }
}
