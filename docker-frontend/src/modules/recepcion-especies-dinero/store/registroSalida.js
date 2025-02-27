import { apiESPECIEDINERO } from '@/config/axios'

export default {
  namespaced: true,
  datosRegistroSalidaTemporal: {},
  dataActa: {},
  dataActaSalidaTemporal: {},
  dataActaSalidaTransferencia: {},
  dataEspecieSalidaTEmporal: [],
  dataSalidaTransferenciaDinero: {},
  dataSalidaTransferencia: {},
  dataRegistrarSalidaTransferenciaEspecie: {},

  actions: {
    registroSalida_getSolicitudSalida ({ commit, state }, payload) {
      try {
        commit('registroSalida_SET_DATA_SOLICITUD_SALIDA', payload)
        return payload
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async registroSalida_comprobanteRegistrarSalidaTemporal ({ commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`especie-salida/comprobante-salida-by-nue/${payload.nue}`)
        commit('registroSalida_DATA_ACTA', data)
        return data.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async registroSalida_ingresarSolicitudSalidaperitaje ({ commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post(`/especie-salida/temporal/solicitud-salida/peritaje`, payload)
        commit('registroSalida_SET_DATA_SOLICITUD_SALIDA_PERITAJE', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async registroSalida_ingresarSolicitudSalida ({ commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post(`/especie-salida/temporal/solicitud-salida`, payload)
        // commit('registroSalida_SET_DATA_SOLICITUD_SALIDA_PERITAJE', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async registroSalida_ingresarSolicitudSalidaTransferencia ({ commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post(`/especie-salida/transferencia/solicitud-salida`, payload)
        commit('registroSalida_SET_DATA_SOLICITUD_SALIDA_TRANSFERENCIA', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async registroSalida_ingresarSolicitudSalidaTransferenciaDinero ({ commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post(`/especie-salida/transferencia-dinero/solicitud-salida`, payload)
        commit('registroSalida_SET_DATA_SOLICITUD_SALIDA_TRANSFERENCIA_DINERO', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async registroSalida_getEspeciesSalidaTemporal ({ commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`especie-salida/temporal/${payload.idTipoSalida}/${payload.nue}`)
        commit('registroSalida_DATA_ESPECIE_SALIDA_TEMPORAL', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async registroSalida_registroSalidaTemporal ({ _commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.put(`/especie-salida/temporal/registrar-salida`, payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async registroSalida_generarActaSalida ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.put(`/especie-salida/temporal/generar-acta`, payload)
        commit('registroSalida_DATA_ACTA_SALIDA_TEMPORAL', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async registroSalida_generarActaSalidaTransferencia ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.put(`/especie-salida/transferencia/generar-acta`, payload)
        commit('registroSalida_DATA_ACTA_SALIDA_TRANSFERENCIA', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async registroSalida_registrarComprobanteTransferencia ({ commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post(`/especie-salida/transferencia-dinero/registrar/comprobante-transferencia`, payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    registroSalida_registrarSalidaPorTransferenciaEspecie ({ commit, state }, payload) {
      try {
        commit('registroSalida_SET_DATA_SALIDA_TRANSFERENCIA_ESPECIE', payload)
        return payload
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async registroSalida_registroSalidaTransferencia ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.put(`/especie-salida/transferencia/registrar/salida`, payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  mutations: {
    registroSalida_SET_DATA_SOLICITUD_SALIDA (state, payload) {
      state.datosRegistroSalidaTemporal = payload.data
      console.log('data temporal', state.datosRegistroSalidaTemporal)
    },
    registroSalida_SET_DATA_SOLICITUD_SALIDA_PERITAJE (state, payload) {
      state.peritajeSalida = payload
      console.log('peritaje', state.peritajeSalida)
    },
    registroSalida_DATA_ACTA (state, payload) {
      console.log('es la dAta', payload)
      state.dataActa = payload
    },
    registroSalida_DATA_ACTA_SALIDA_TEMPORAL (state, payload) {
      state.dataActaSalidaTemporal = payload
      console.log('acta salida', state.dataActaSalidaTemporal)
    },
    registroSalida_DATA_ACTA_SALIDA_TRANSFERENCIA (state, payload) {
      state.dataActaSalidaTransferencia = payload
      console.log('acta salida trans', state.dataActaSalidaTransferencia)
    },
    registroSalida_DATA_ESPECIE_SALIDA_TEMPORAL (state, payload) {
      state.dataEspecieSalidaTEmporal = payload
      console.log('acta especie', state.dataEspecieSalidaTEmporal)
    },
    registroSalida_SET_DATA_SOLICITUD_SALIDA_TRANSFERENCIA (state, payload) {
      state.dataSalidaTransferencia = payload
      console.log('peritaje', state.peritajeSalida)
    },
    registroSalida_SET_DATA_SOLICITUD_SALIDA_TRANSFERENCIA_DINERO (state, payload) {
      state.dataSalidaTransferenciaDinero = payload
      console.log('trans dinero', state.peritajeSalida)
    },
    registroSalida_SET_DATA_SALIDA_TRANSFERENCIA_ESPECIE (state, payload) {
      state.dataRegistrarSalidaTransferenciaEspecie = payload.data
      console.log('dataRegistrarSalidaTransferenciaEspecie', state.dataRegistrarSalidaTransferenciaEspecie)
    }
  }
}
