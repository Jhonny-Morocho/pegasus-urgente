import { apiRGP } from '@/config/axios/apiRGP.axios'

export default {
  namespaced: true,

  state: {
    familiaEspecies: [],
    tipoEspecies: [],
    especies: [],
    fotoVideoEspecie: [],
    dineros: [],
    documentoGeolocalizacion: []
  },

  getters: {
    getStoreEspecieDinero (state) {
      const { especies } = state

      return {
        especies
      }
    }
  },

  actions: {
    async stepEspeciesDinero_get_familia_especies ({ commit }) {
      return apiRGP.get('mantenedor/mantenedores/familia-especie').then((res) => {
        commit('StepEspeciesDinero_SET_FAMLIA_ESPECIES', res.data)
      })
    },
    async stepEspeciesDinero_get_tipo_especie ({ commit }) {
      return apiRGP.get('/mantenedor/mantenedores/tipo-especie').then((res) => {
        commit('StepEspeciesDinero_SET_TIPO_ESPECIE', res.data)
      })
    },
    async stepEspeciesDinero_addEspecie ({ commit }, payload) {
      console.log('payload en action: ', payload)
      return apiRGP.post('/especiedinero/especies-dinero/', payload).then((res) => {
        console.log(res.data)
        commit('stepEspeciesDinero_ADD_ESPECIE', res.data)
      })
    }
  },
  mutations: {
    StepEspeciesDinero_SET_FAMLIA_ESPECIES (state, payload) {
      state.familiaEspecies = payload
    },
    StepEspeciesDinero_SET_TIPO_ESPECIE (state, payload) {
      state.tipoEspecies = payload
    },
    stepEspeciesDinero_ADD_ESPECIE (state, data) {
      state.especies.push(data)
      state.dineros = []
      console.log('Res guardad en store: ', state.especies)
    },
    stepEspeciesDinero_ADD_FOTOGRAFIA_VIDEO (state, fotoVideo) {
      state.fotoVideoEspecie.push(fotoVideo)
    },
    stepEspeciesDinero_DELETE_FOTOGRAFIA_VIDEO (state, index) {
      state.fotoVideoEspecie.splice(index, 1)
    },
    stepEspeciesDinero_ADD_ONE_DINERO (state, payload) {
      state.dineros.push(payload)
    },
    stepEspeciesDinero_DELETE_ONE_DINERO (state, index) {
      state.dineros.splice(index, 1)
    },
    stepEspeciesDinero_ADD_DOCUMENT_GEO (state, payload) {
      state.documentoGeolocalizacion.push(payload)
    },
    stepEspeciesDinero_DELETE_ONE_DOCUMENT_GEO (state, index) {
      state.documentoGeolocalizacion.splice(index, 1)
    },
    stepEspeciesDinero_SET_DEFAULT_STATE (state) {
      state.especies = []
      state.fotoVideoEspecie = []
      state.dineros = []
      state.documentoGeolocalizacion = []
    },
    stepEspeciesDinero_SET_ESPECIE (state, payload) {
      state.especies = payload
    }
  }
}
