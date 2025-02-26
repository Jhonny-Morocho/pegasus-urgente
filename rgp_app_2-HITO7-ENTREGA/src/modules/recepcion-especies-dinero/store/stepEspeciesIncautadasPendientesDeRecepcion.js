import { apiESPECIEDINERO } from '@/config/axios'

export default {
  namespaced: true,

  state: () => ({
    especiesIncautadas: {},
    especieDecision: {},
    dineroIncautadoSeleccionado: {},
    dinerosIncautados: {},
    especiesDinerosNoIngresados: [],
    dataEspeciesNoIngresadas: {}
  }),

  actions: {
    async stepEspeciesIncautadasPendientesDeRecepcion_separarPorNue (
      { commit, state },
      payload
    ) {
      try {
        const { data } = await apiESPECIEDINERO.put('especie-o-dinero/separar-especie', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepEspeciesIncautadasPendientesDeRecepcion_getEspecieDineroNoIngresado (
      { commit, state },
      payload
    ) {
      try {
        const data = await apiESPECIEDINERO.get(
          `especie-o-dinero/no-ingresado/${payload.nue}`
        )
        commit(
          'stepEspeciesIncautadasPendientesDeRecepcion_SET_ESPECIES_NO_INGRESADAS',
          data.data
        )
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepEspeciesIncautadasPendientesDeRecepcion_aceptarORechazarEspecies (
      { commit, state },
      payload
    ) {
      try {
        const { data } = await apiESPECIEDINERO.post(
          'especies-recepcion/aceptarORechazarEspecies',
          payload
        )
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepEspeciesIncautadasPendientesDeRecepcion_setEspeciePeligrosa (
      { commit, state },
      payload
    ) {
      console.log('marcarEspeciePeligrosa', payload)
      try {
        const { data } = await apiESPECIEDINERO.post(
          '/especies-recepcion/marcarEspeciePeligrosa/',
          payload
        )
        console.log(data)
      } catch (error) {
        console.log(error)
        return Promise.reject(error)
      }
    },
    async stepEspeciesIncautadasPendientesDeRecepcion_aceptarORechazar (
      { commit, state },
      payload
    ) {
      try {
        const { data } = await apiESPECIEDINERO.post(
          'especies-recepcion/aceptarORechazarEspecies',
          payload
        )
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdDenunciaNue (
      { commit },
      payload
    ) {
      const { idDenuncia: id, nue } = payload
      try {
        const response = await apiESPECIEDINERO.get(
          `/especie-o-dinero/denuncia-especie-dinero/${id}/${nue}`
        )
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie (
      { commit, state },
      payload
    ) {
      const id = payload.id
      const ruc = payload.ruc
      try {
        let { data } = await apiESPECIEDINERO.get(`/especie-o-dinero/especie-by-id/${id}`)
        data = { ...data, ruc }
        commit(
          'stepEspeciesIncautadasPendientesDeRecepcion_SET_DESGLOSE', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepEspeciesIncautadasPendientesDeRecepcion_rectifcarMonto (
      { commit, state },
      payload
    ) {
      try {
        const { data } = await apiESPECIEDINERO.post(
          'especie-o-dinero/rectificar-monto',
          payload
        )
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepEspeciesIncautadasPendientesDeRecepcion_ingresarDesgloseDinero ({ commit, state }, payload) {
      try {
        const data = await apiESPECIEDINERO.put('/especie-o-dinero/ingresar-desglose-dinero/', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    especieIncautadaPendienteRecepcion_SET_DECISION: (state, especieDecision) => {
      state.especieDecision = especieDecision
    },
    stepEspeciesIncautadasPendientesDeRecepcion_SET_DINERO_INCAUTADO_SELECCIONADO: (state, dineroIncautado) => {
      state.dineroIncautadoSeleccionado = dineroIncautado
    },
    stepEspeciesIncautadasPendientesDeRecepcion_SET_DESGLOSE: (state, data) => {
      state.especiesIncautadas = data
    },
    stepEspeciesIncautadasPendientesDeRecepcion_RECTIFICAR_MONTO: (state, data) => {
      console.log('RECTIFICAR_MONTO', data)
    },
    stepEspeciesIncautadasPendientesDeRecepcion_RESET: (state) => {
      state.especiesIncautadas = {}
    },
    stepEspeciesIncautadasPendientesDeRecepcion_SET_ESPECIES_NO_INGRESADAS: (state, data) => {
      state.dataEspeciesNoIngresadas = data
    }
  }
}
