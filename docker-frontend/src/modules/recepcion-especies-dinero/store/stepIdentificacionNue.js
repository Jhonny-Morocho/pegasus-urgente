import { apiESPECIEDINERO } from '@/config/axios'
import { causas } from '@/data/EYD/dataConsultaPorNue.json'

export default {
  namespaced: true,

  state: () => ({
    causasMock: null,
    causaEncontradaAsociadaANue: [],
    dataNueEncontrado: []
  }),

  actions: {
    async stepIdentificacionNue_controlarDuplicadoNue ({ commit, state }, payload) {
      commit('stepIdentificacionNue_RESET_CAUSA_ENCONTRADA')
      try {
        const { data: causa } = await apiESPECIEDINERO.get(`/especies-recepcion?nue=${payload.nue}`)
        causa.nue = payload.nue
        commit('stepIdentificacionNue_SET_CAUSA_ENCONTRADA', causa)
        return causa
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIdentificacionNue_getPorNue ({ commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`nue/${payload.nue}`)
        commit('stepIdentificacionNue_SET_NUE_ENCONTRADO', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIdentificacionNue_solicitudRucAlAdministrador ({ _commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post(`especie-o-dinero/solicitar-ruc-administrador`, payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIdentificacionNue_obtenerCausaPorRUC ({ commit }, payload) {
      try {
        const response = await apiESPECIEDINERO.get(`/especies-recepcion/ruc/${payload.ruc}`)
        commit('stepIdentificacionNue_SET_CAUSA_ENCONTRADA', response.data)
        const data = response.data
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIdentificacionNue_agregarEspecieNue ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post(`/especies-recepcion/`, payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIdentificacionNue_obtenerDocumentosByIdEspecie ({ commit }, payload) {
      try {
        const response = await apiESPECIEDINERO.get(`/filenet/documentos-by-id-especie/${payload.idEspecie}`)
        const data = response.data
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    stepIdentificacionNue_SET_CAUSA_ENCONTRADA (state, causa) {
      state.causaEncontradaAsociadaANue = causa
    },
    stepIdentificacionNue_SET_NUE_ENCONTRADO (state, data) {
      state.dataNueEncontrado = data
    },
    stepIdentificacionNue_SET_DATA_MOCK (state) {
      state.causasMock = causas
    },
    stepIdentificacionNue_RESET_CAUSA_ENCONTRADA (state) {
      state.causaEncontradaAsociadaANue = []
    },
    stepIdentificacionNue_RECTIFICAR_MONTO (state, payload) {
      console.log(payload)
      const dataDineros = state.causaEncontradaAsociadaANue.especiesDinero[0].dineros[0]
      dataDineros.desglose = payload.nuevoDesglose
      dataDineros.montoRectificado = payload.nuevoTotal
      dataDineros.difrenciaMonto = payload.diferencia
      console.log('Dinero Rectificado en Store: ', dataDineros)
    },
    especieIncautadaPendienteRecepcion_SET_DECISION: (state, payload) => {
      console.log(payload.payload)
      if (payload.esDinero) state.causaEncontradaAsociadaANue.especiesDinero[0].dineros[0].destinoDinero = payload.payload
      else state.causaEncontradaAsociadaANue.especiesDinero[0].destinoDinero = payload.payload
    },
    especieIncautadaPendienteRecepcion_SET_ESPECIE_PELIGROSA: (state) => {
      state.causaEncontradaAsociadaANue.especiesDinero[0].alerta = 'Especie Peligrosa'
    }
  }
}
