import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    // Data Causa creada o seleccionada
    causaSeleccionada: null,
    ruc: null,
    idDenuncia: null,
    dataDenuncia: null,
    processInstanceId: null,
    idCausa: null,
    paginacion: null,

    // data para antecedentes especificos
    antecedentesEspecificos: [],
    antecedentesSolicitados: [],
    relaciones: [],
    dataSujetoSeleccionado: null
  },

  getters: {
    fichaCausa_getNombreAntecedentes: (state) => (idAntecedente) => {
      const antecedenteFound = state.antecedentesEspecificos?.find(
        (a) => a.idAntecedenteDisponible === idAntecedente
      )
      return antecedenteFound?.nombreAntecedente
    },

    fichaCausa_getNombreOrigenAntecedentes: (state) => (idOrigen) => {
      const antecedenteFound = state.antecedentesEspecificos?.find(
        (a) => a.idOrigen === idOrigen
      )
      return antecedenteFound?.nombreOrigen
    }
  },

  actions: {
    async fichaCausa_getCausa ({ commit }, payload) {
      try {
        const response = await apiRGP.get(`/causa/causas/denuncia/${payload.idDenuncia}`)
        const data = response.data
        commit('fichaCausa_SET_CAUSA', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async fichaCausa_obtenerCausaPorRUC ({ commit }, payload) {
      console.log(payload)
      try {
        const response = await apiRGP.get(`/causa/causas/rolUnico/${payload.ruc}`)
        const data = response.data
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async fichaCausa_getAntecedentesEspecificos ({ commit }) {
      try {
        const res = await apiRGP.get('mantenedor/antecedente/antecedente-disponible')
        const data = res.data.data
        const paginacion = res.data.paginacion
        commit('fichaCausa_SET_ANTECEDENTES_ESPECIFICOS', data)
        commit('fichaCausa_SET_PAGINACION', paginacion)
      } catch (error) {
        Promise.reject(error)
      }
    },

    async fichaCausa_postSolicitarAntecedentes ({ _commit }, antecedente) {
      try {
        const res = await apiRGP.post('/mantenedor/antecedente/antecedente-solicitado', antecedente)
        return Promise.resolve(res)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async fichaCausa_getAntecedentesSolicitados ({ commit }, payload) {
      try {
        const res = await apiRGP.get(`/mantenedor/causa/antecedente-origen/${payload.idDenuncia}/antecedente`)
        const data = res.data.data
        commit('fichaCausa_SET_ANTECEDENTES_SOLICITADOS', data)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async fichaCausa_recomendacionPreclasificador (_, payload) {
      try {
        const { ruc, causa } = payload

        const res = await apiRGP.put(`causa/causas/recomendacion-preclasificacion/${ruc}`, causa)

        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    fichaCausa_SET_CAUSA (state, causa) {
      state.causaSeleccionada = causa
      state.ruc = causa.rolUnico
      state.idDenuncia = causa.idDenuncia
      state.idCausa = causa.idCausa
      // state.processInstanceId = causa.taskId
    },
    fichaCausa_SET_RELACIONES (state, relaciones) {
      state.relaciones = relaciones
    },
    fichaCausa_SET_ANTECEDENTES_ESPECIFICOS (state, data) {
      state.antecedentesEspecificos = data
    },
    fichaCausa_SET_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    },
    fichaCausa_SET_ANTECEDENTES_SOLICITADOS (state, antecedente) {
      state.antecedentesSolicitados = antecedente
    },
    fichaCausa_SET_ANTECEDENTE_RESOLICITADO (state, antecedente) {
      const index = state.antecedentesSolicitados.findIndex((a) => a.id === antecedente.id)
      state.antecedentesSolicitados[index] = antecedente
    },
    fichaCausa_SET_SUJETO_SELECCIONADO (state, dataSujeto) {
      state.dataSujetoSeleccionado = dataSujeto
    },
    fichaCausa_SET_DEFAULT_STATE (state) {
      state.causaSeleccionada = {}
      state.ruc = null
      state.idDenuncia = null
      state.dataDenuncia = []
      state.processInstanceId = null
      state.idCausa = null
      state.paginacion = []
      state.antecedentesEspecificos = []
      state.relaciones = []
      state.dataSujetoSeleccionado = null
    }
  }
}
