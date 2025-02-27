import { apiRGP } from '@/config/axios'

// DISCLAIMER: A PESAR DE ESTAR EN PRECLASIFICADOR, SE UTILIZA EN H5 y H6
export default {
  namespaced: true,

  state: {
    antecedentesEspecificos: [],
    origenesAntecedentes: [],
    antecedentesSolicitados: [],
    paginacion: null
  },

  actions: {
    async solicitudAntecedentes_getAntecedentesEspecificos ({ commit }, _payload) {
      try {
        const res = await apiRGP.get('mantenedor/antecedente/antecedente-disponible')
        const data = res.data.data
        const paginacion = res.data.paginacion
        commit('solicitudAntecedentes_SET_ANTECEDENTES_ESPECIFICOS', data)
        commit('solicitudAntecedentes_SET_PAGINACION', paginacion)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async solicitudAntecedentes_getAntecedentesSolicitados ({ commit }, payload) {
      try {
        const res = await apiRGP.get(`/mantenedor/antecedente/antecedente-solicitado/${payload.idDenuncia}`)
        const data = res.data.data
        commit('solicitudAntecedentes_SET_ANTECEDENTES_SOLICITADOS', data)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async solicitudAntecedentes_solicitarAntecedenteEspecifico ({ _commit }, antecedente) {
      try {
        const res = await apiRGP.post('/mantenedor/antecedente/antecedente-solicitado', antecedente)
        return Promise.resolve(res)
      } catch (error) {
        Promise.reject(error)
      }
    }
  },

  mutations: {
    solicitudAntecedentes_SET_ANTECEDENTES_ESPECIFICOS (state, data) {
      state.antecedentesEspecificos = data
    },

    solicitudAntecedentes_SET_ORIGEN_ANTECEDENTES (state, data) {
      state.origenesAntecedentes = data
    },
    solicitudAntecedentes_SET_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    },

    solicitudAntecedentes_SET_ANTECEDENTES_SOLICITADOS (state, data) {
      state.antecedentesSolicitados = data
    },

    solicitudAntecedentes_SET_PAGINACION_ANTECEDENTES_SOLICITADOS (state, data) {
      state.paginacionAntecedentesSolicitados = data
    }
  }
}
