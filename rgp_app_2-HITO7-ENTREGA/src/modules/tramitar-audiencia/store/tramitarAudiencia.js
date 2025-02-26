import { apiRGP, apiTAUD } from '@/config/axios/'
import { causa, diligencias, listaMedidasCautelares, antecedentesAudiencia, tiposAudiencia, otrosTiposAudiencia, audiosMock, nominaMock } from '@/modules/tramitar-audiencia/data/data.json'
import { resultado1, resultado2 } from '@/modules/tramitar-audiencia/data/resultadosMock2.json'
export default {
  namespaced: true,

  state: () => ({
    causa: {},
    ruc: '',
    idDenuncia: '',
    relacionesSeleccionadas: [],
    especiesSeleccionadas: [],
    documentosSeleccionados: [],
    medidasCautelares: [],
    deligencias: [],
    audiosMarcados: [],
    nomina: [],
    minuta: [],
    historialCausa: []
  }),

  actions: {
    async tramitarAudiencia_getAntecedentesCausa ({ commit, state }) {
      if (!state.idDenuncia) {
        commit('tramitarAudiencia_SET_CAUSA', causa)
        console.log('No hay id de denuncia')
        return causa
      } else {
        try {
          // const { data } = await apiRGP.get(`/causas/antecedentes/${state.idDenuncia}`)
          const { data } = await apiRGP.get(`causa/causas/denuncia/${state.idDenuncia}`)
          const { data: masData } = await apiRGP.get(`denuncia/denuncias/find-denuncia/${state.idDenuncia}`)
          commit('tramitarAudiencia_SET_CAUSA', { ...data, idCatalogo: masData.idCatalogo })
          return Promise.resolve(data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async tramitarAudiencia_getAntecedentesAudiencia ({ commit, state }) {
      try {
        await apiTAUD.get('/example/')
      } catch (e) {
        console.error(e)
      }
      return antecedentesAudiencia
    },
    async tramitarAudiencia_postSolicitudAudiencia ({ commit }, payload) {
      try {
        await apiTAUD.post('/solicitud-audiencia/', payload)
      } catch (e) {
        console.error(e)
      }
    },
    async tramitarAudiencia_respuestaPrevioResolver ({ commit }, respuestaFiscal) {
      console.log('Al back cuando haya: ', respuestaFiscal)
    },

    // minuta
    async tramitarAudiencia_getMinuta ({ commit }, payload) {
      try {
        const { data } = await apiTAUD.get(`/minuta/${payload.idSolicitud}`)
        data.idSolicitud = payload.idSolicitud
        data.idTarea = payload.idTarea
        commit('tramitarAudiencia_SET_MINUTA', data)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async tramitarAudiencia_postMinuta ({ commit }, payload) {
      try {
        console.log(payload)
        const { data } = await apiTAUD.post(`/minuta`, payload)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // Nómina Detenidos

    async tramitarAudiencia_getNominaDetenidos ({ commit }) {
      commit('tramitarAudiencia_SET_NOMINA', nominaMock)
    },
    async tramitarAudiencia_addNuevoDetenidoACD ({ commit, state }, payload) {
      const nuevaNomina = [...state.nomina, payload.detenido]
      commit('tramitarAudiencia_SET_NOMINA', nuevaNomina)
    },
    async tramitarAudiencia_apercibirDetenidoACD ({ commit, state }, { numeroDocumento }) {
      console.log({ numeroDocumento })
      const nuevaNomina = state.nomina.filter((detenido) => detenido.numeroDocumento !== numeroDocumento)
      console.log({ nuevaNomina })
      commit('tramitarAudiencia_SET_NOMINA', nuevaNomina)
    },
    async tramitarAudiencia_postNominaACD ({ commit }, nomina) {
      console.log(nomina)
    },

    /************************************/

    async tramitarAudiencia_getHistorialCausa ({ commit }, payload) {
      try {
        const { idCausa, params } = payload
        const { data } = await apiTAUD.get(`/audiencia/historial/${idCausa}${params.page}${params.size}${params.order}`)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async tramitarAudiencia_getDiligencias ({ commit }, ruc) {
      console.log(`get diligencias by ${ruc}`)
      commit('tramitarAudiencia_SET_DILIGENCIAS', diligencias)
    },
    async tramitarAudiencia_postRegistroAudiencia ({ commit, payload }) {
      console.log(payload)
    },
    async tramitarAudiencia_updateActualizarMinuta ({ commit }, minuta) {
      console.log(minuta)
    },
    async tramitarAudiencia_getAudiosAudiencia ({ commit }) {
      commit('tramitarAudiencia_SET_AUDIOS_MARCADOS', audiosMock)
    },
    async mantenedor_getListaMedidasCautelares ({ commit }) {
      return listaMedidasCautelares
    },
    async mantenedor_getListaTiposAudiencia ({ commit }) {
      return tiposAudiencia
    },
    async mantenedor_getListaOtrosTiposAudiencia ({ commit }) {
      return otrosTiposAudiencia
    },

    async tramitarAudiencia_getResultadosAudiencia () {
      const resultados = [resultado1, resultado2]
      return resultados
    }
  },

  mutations: {
    tramitarAudiencia_SET_RUC (state, ruc) {
      state.ruc = ruc
    },
    tramitarAudiencia_SET_ID_DENUNCIA (state, idDenuncia) {
      state.idDenuncia = idDenuncia
    },
    tramitarAudiencia_SET_CAUSA (state, payload) {
      state.causa = { ...payload }
    },
    tramitarAudiencia_SET_MEDIDAS_CAUTELARES (state, payload) {
      state.medidasCautelares.push(payload)
    },
    tramitarAudiencia_DELETE_MEDIDA_CAUTELAR (state, payload) {
      state.medidasCautelares = state.medidasCautelares.filter(m => m.medida !== payload.medida)
    },
    tramitarAudiencia_RESET_MEDIDAS_CAUTELARES (state, payload) {
      state.medidasCautelares = []
    },
    tramitarAudiencia_SET_RELACIONES (state, payload) {
      state.relacionesSeleccionadas = payload
    },
    tramitarAudiencia_SET_ESPECIES (state, payload) {
      state.especiesSeleccionadas = { ...payload }
    },
    tramitarAudiencia_SET_DOCS (state, payload) {
      state.documentosSeleccionados = payload
    },
    tramitarAudiencia_SET_DILIGENCIAS (state, payload) {
      state.deligencias = { ...payload }
    },
    tramitarAudiencia_SET_AUDIOS_MARCADOS (state, payload) {
      state.audiosMarcados = payload
    },
    tramitarAudiencia_ADD_MARCADOR (state, payload) {
      state.audiosMarcados.value = payload
    },
    tramitarAudiencia_SET_NOMINA (state, nomina) {
      state.nomina = nomina
    },
    tramitarAudiencia_ADD_NOMINA (state, nomina) {
      state.nomina.value = nomina
    },
    tramitarAudiencia_SET_MINUTA (state, data) {
      state.minuta = data
    },
    tramitarAudiencia_SET_HISTORIAL_CAUSAS (state, data) {
      state.historialCausa = data
    }
  }
}
