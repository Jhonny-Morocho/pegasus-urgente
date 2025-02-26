import { apiESPECIEDINERO } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    listaDineros: [],
    dinerosCustodia: {},
    dataCodigoBarra: {}
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
    async generarCuponDeDeposito_addgenerarCupon ({ _commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post('/especie-cupon/generar-cupon-deposito', payload.payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async generarCuponDeDeposito_getListaDineros ({ commit }, payload) {
      const { data } = await apiESPECIEDINERO.get(`especie-cupon/candidatos-cupon-deposito/${payload.idFuncionario}/${payload.tipoMoneda}`)
      commit('generarCuponDeDeposito_GET_LISTA_DINEROS', data)
      return data
    },
    async generarCuponDeDeposito_getDinerosCustodiaParaGenerarCupon ({ commit }, payload) {
      const { data } = await apiESPECIEDINERO.get(`/pam/bandejaDeEntradaDineroEYD`)
      commit('generarCuponDeDeposito_GET_LISTA_DINEROS', data)
      return data
    },
    async generarCuponDeDeposito_getDinerosCustodia ({ commit }, payload) {
      try {
        const data = await apiESPECIEDINERO.post(`/pam/iniciarProceso/custodia-dinero/${payload.idEspecie}`, payload)
        commit(
          'generarCuponDeDeposito_GET_DINEROS_DEPOSITO',
          data.data
        )
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async generarCuponDeDeposito_generarCodigoDeBarra ({ commit }, payload) {
      try {
        const data = await apiESPECIEDINERO.post(`custodia-dinero/generar-codigo-barras`, payload)
        commit(
          'generarCuponDeDeposito_DATA_CODIGO_BARRA',
          data.data
        )
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async generarCuponDeDeposito_guardarCuponYSalir ({ commit }, payload) {
      try {
        const data = await apiESPECIEDINERO.post(`especie-cupon/separar-cupon-deposito`, payload)
        commit(
          'generarCuponDeDeposito_DATA_CODIGO_BARRA',
          data.data
        )
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  mutations: {
    generarCuponDeDeposito_GET_LISTA_DINEROS (state, data) {
      state.listaDineros = data
    },
    generarCuponDeDeposito_GET_DINEROS_DEPOSITO (state, data) {
      state.dinerosCustodia = data
    },
    generarCuponDeDeposito_DATA_CODIGO_BARRA (state, data) {
      state.dataCodigoBarra = data
    }
  }
}
