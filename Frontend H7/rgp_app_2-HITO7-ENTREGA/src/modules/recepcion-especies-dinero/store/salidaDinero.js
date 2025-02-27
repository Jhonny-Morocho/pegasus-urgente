import { apiESPECIEDINERO } from '@/config/axios'
export default {
  namespaced: true,
  datosRegistroChequeRecibido: {},
  datosRegistroDeposito: {},
  actions: {
    async salidaDinero_registrarMetodoEntrega ({ _commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.put('especie-salida/transferencia-dinero/registrar/metodo-entrega', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async salidaDinero_generarCheque ({ _commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post('especie-salida/transferencia-dinero/registrar/emision-cheque', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async salidaDinero_registrarEntregaCheque ({ _commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.put('especie-salida/registrar-entrega-cheque', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async salidaDinero_registrarRecepcionCheque ({ _commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.put('/especie-salida/registrar-recepcion-cheque', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async salidaDinero_dataRegistrarChequeRecibido ({ commit }, payload) {
      try {
        commit('salidaDinero_DATA_REGISTRAR_CHEQUE', payload)
        return payload
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async salidaDinero_dataRegistrarDeposito ({ commit }, payload) {
      try {
        commit('salidaDinero_DATA_REGISTRAR_DEPOSITO', payload)
        return payload
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  mutations: {
    salidaDinero_DATA_REGISTRAR_CHEQUE (state, payload) {
      state.datosRegistroChequeRecibido = payload.data
      console.log('data cheque', state.datosRegistroChequeRecibido)
    },
    salidaDinero_DATA_REGISTRAR_DEPOSITO (state, payload) {
      state.datosRegistroDeposito = payload.data
      console.log('data deposito', state.datosRegistroDeposito)
    }

  }
}
