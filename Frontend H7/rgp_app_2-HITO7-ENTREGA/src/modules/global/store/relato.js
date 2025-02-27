import { apiRGP } from '@/config/axios/'

function nombreCompleto (data) {
  return `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`
}

export default {
  namespaced: true,

  state: () => ({
    relato: null,
    relatoObtenido: null
  }),

  getters: {
    getIntervinientes: (_state, _getters, rootState) => (tipo) => {
      const sujetos = rootState?.sujetosIntervinientes?.sujetos
      const intervinientes = sujetos?.map((s) => {
        return {
          tipoSujeto: s.tipoSujeto,
          nombre: nombreCompleto(s),
          rut: s.numeroDocumento
        }
      })
      const intervinienteTipo = intervinientes?.filter(
        (i) => i.tipoSujeto === tipo
      )
      if (intervinienteTipo?.length) {
        return intervinienteTipo
      } else {
        return [
          {
            rut: '00000000-0',
            nombre: `NOMBRE_${tipo?.toUpperCase()}`
          }
        ]
      }
    },

    getEspecies: (_state, _getters, rootState) => {
      const especies = rootState?.especiesDineroGb?.especies

      if (especies?.length) {
        return especies?.map((e) => {
          return {
            ambitoEspecie: e.ambitoEspecie,
            familiaEspecie: e.familiaEspecie,
            tipoEspecie: e.idTipoEspecie
          }
        })
      } else {
        return [
          {
            ambitoEspecie: '1',
            familiaEspecie: '1',
            tipoEspecie: '1'
          }
        ]
      }
    },

    getDelitos: (_state, _getters, rootState) => {
      const delitos = rootState?.delitoGb?.delitos

      if (delitos?.length) {
        return delitos?.map((d) => {
          return {
            idDenuncia: d.idDenuncia,
            familiaDelito: d.delito?.idFamiliaDelito,
            descripcionDelito: d.delito?.descripcionDelito,
            fechaOcurrencia: d.fechaHoraRango
              ? d.fechaHoraDelitoInicio
              : d.fechaOcurrencia,
            fechaHoraDelitoInicio: d.fechaHoraDelitoInicio,
            fechaHoraDelitoFin: d.fechaHoraDelitoFin,
            lugarOcurrencia:
              d.lugarDelito?.lugarOcurrencia || 'LUGAR_OCURRENCIA',
            lugarEspecificoOcurrencia:
              d.lugarDelito?.lugarEspecificoOcurrencia ||
              'LUGAR_ESPECIFICO_OCURRENCIA'
          }
        })
      } else {
        return []
      }
    }
  },

  mutations: {
    relato_SET_RELATO_PRINCIPAL (state, payload) {
      // evita que se pierda el idRelato si es que existe previamente
      const idRelato = state.relato?.idRelato
      state.relato = {}
      state.relato.relato = payload
      state.relato.idRelato = idRelato
    },

    relato_SET_RELATO (state, payload) {
      state.relato = payload
    },

    relato_SET_DEFAULT_STATE (state) {
      state.relato = null
    },
    relato_SET_RELATO_OBTENIDO (state, payload) {
      state.relatoObtenido = payload.data
    }
  },

  actions: {
    async relato_getPropuestaPlantilla ({ commit }, payload) {
      return apiRGP
        .post(`/denuncia/propuestas-relatos/`, payload)
        .then((res) => {
          commit('relato_SET_RELATO_PRINCIPAL', res.data)
        })
    },

    async relato_getPropuestaRelatoById ({ commit }, payload) {
      return apiRGP
        .get(`/denuncia/propuestas-relatos/${payload.id}`, payload)
        .then((res) => {
          commit('relato_SET_RELATO', res.data)
        })
    },

    async relato_guardarRelato ({ commit }, payload) {
      return apiRGP.post('/denuncia/relatos/', payload).then((res) => {
        commit('relato_SET_RELATO', res.data)
      })
    },

    async relato_editarRelato ({ commit }, payload) {
      return apiRGP
        .put(`/denuncia/relatos/${payload.idRelato}`, payload)
        .then((res) => {
          commit('relato_SET_RELATO', res.data)
        })
    },

    async relato_getRelatoByIdDenuncia ({ commit }, idDenuncia) {
      const idDenun = idDenuncia.idDenuncia || idDenuncia.data.denuncia.idDenuncia
      try {
        const response = await apiRGP.get(`denuncia/relatos/denuncia/${idDenun}`)
        response.data.relato = response.data.descripcionRelato
        response.data.idRelato = response.data.id
        commit('relato_SET_RELATO', response.data)
        return response
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
