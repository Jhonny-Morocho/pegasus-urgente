import { apiRGP, apiESPECIEDINERO } from '@/config/axios'

export default {
  namespaced: true,

  state: () => ({
    especiesDinero: [],
    paginacion: null,
    especieDineroSeleccionadaEnBandeja: [],
    flujo: 'busqueda'
  }),

  actions: {
    async bandejaCustodio_getDataBandeja ({ commit }, params) {
      try {
        const response = await apiESPECIEDINERO.get(`/pam/bandejaDeEntradaEYD`, { params })
        commit('bandejaCustodio_SET_ESPECIES_BANDEJA', response.data)
        commit('bandejaCustodio_SET_PAGINACION_BANDEJA', response.data.paginacion)
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async bandejaCustodio_actualizarPrioridad ({ _commit }, dataTarea) {
      try {
        const res = await apiRGP.put('/bandeja/bandeja-custodio/prioridad', dataTarea)
        const { data } = res.data
        return data.prioritario
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    bandejaCustodio_SET_ESPECIES_BANDEJA (state, data) {
      state.especiesDinero = data
    },
    bandejaCustodio_SET_PAGINACION_BANDEJA (state, paginacion) {
      state.paginacion = paginacion
    },
    bandejaCustodio_SET_ESPECIE_DINERO_SELECCIONADA (state, especieDinero) {
      state.especieDineroSeleccionadaEnBandeja = especieDinero
      console.log('Especie seteada en store: ', state.especieDineroSeleccionadaEnBandeja)
    },
    bandejaCustodio_SET_PRIORITARIO (state, { especieDinero, value }) {
      const index = state.especiesDinero.findIndex((e) => e.nue === especieDinero.nue)
      state.especiesDinero[index].isPrioritario = value
    },
    bandejaCustodio_SET_ESTADO (state, { especieDinero, estado }) {
      const index = state.especiesDinero.findIndex((e) => e.nue === especieDinero.nue)
      state.especiesDinero[index].estadoTarea = estado
      console.log(state.especiesDinero)
    },
    bandejaCustodio_SET_REGISTRAR_ESPECIE_DINERO: (state, payload) => {
      state.especiesDinero = state.especiesDinero.map((e) => {
        if (e.ruc === payload.ruc) {
          e.nombreTarea = payload.nombreTarea
        }
        return e
      })
    },
    bandejaCustodio_SET_FLUJO (state, flujo) {
      state.flujo = flujo
    }
  }
}
