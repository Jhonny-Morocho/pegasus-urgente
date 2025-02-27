import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: () => ({
    procedimientos: [],
    paginacion: null,
    folioProcedimientoData: null,
    tieneFolio: false,
    esDenunciaDirectaFlagrante: null,
    nextStep: false,
    estadoFolio: null,
    loader: false,
    esNuevaAtencionFiscal: false
  }),

  actions: {
    async procedimientosBandeja_getProcedimientos ({ commit }, { params }) {
      commit('procedimientosBandeja_SET_PROCEDIMIENTOS', [])
      try {
        const { data } = await apiRGP.get(`/bandeja/bandeja/denuncia`, { params })

        commit('procedimientosBandeja_SET_PROCEDIMIENTOS', data.data)
        commit('procedimientosBandeja_SET_PAGINACION', data.paginacion)

        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    procedimientosBandeja_getProcedimiento (_, { idDenuncia }) {
      return apiRGP.get(`bandeja/bandeja-flagrancia/mas-informacion/${idDenuncia}`)
    },

    async procedimientosBandeja_postCerrarFolio ({ _commit }, payload) {
      return apiRGP.post('/flagrancia/folio/procedimiento/cerrar-folio/', payload).then((res) => {
        console.log('respuesta: ', res.data)
      })
    },

    async procedimientosBandeja_postReAbrirFolio ({ _state, _commit }, payload) {
      console.log('postReAbrirFolio', payload)
    },
    async procedimientosBandeja_postSolicitudReAbrirFolio ({ _state, _commit }, payload) {
      console.log('postSolicitudReAbrirFolio', payload)
    },

    async procedimientosBandeja_postResponderSolicitudReAbrirFolio ({ state, commit }, payload) {
      console.log('postResponderSolicitudReAbrirFolio', payload)
    },

    async procedimientosBandeja_crearFolio ({ commit }, payload) {
      try {
        const request = await apiRGP.post('flagrancia/folio/procedimiento/', {
          idProcedimiento: payload.idProcedimiento,
          procesoPam: payload.procesoPam
        })
        commit('stepRegistroContacto/stepRegistroContacto_SET_FOLIO', request.data, { root: true })
        commit('procedimientosBandeja_SET_TIENE_FOLIO', true)
        commit('procedimientosBandeja_NEXT_STEP', true)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    procedimientosBandeja_SET_PROCEDIMIENTOS (state, procedimientos) {
      state.procedimientos = procedimientos
    },
    procedimientosBandeja_SET_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    },
    procedimientoBandeja_SET_ESTADO_PROCEDIMIENTO (state, { procedimiento, estado }) {
      console.log('ESTADO_PROCEDIMIENT', procedimiento, estado)
      const index = state.procedimientos.findIndex((p) => p.folio === procedimiento?.folio)

      console.log('stgate', state.procedimientos)
      state.procedimientos[index].estado = estado
    },

    procedimientosBandeja_ADD_STEPS_PROCEDIMIENTO (state, dataSteps) {
      // state.nuevosProcedimientos.push(dataSteps)
      state.procedimientos.push(dataSteps)
    },

    procedimientosBandeja_SET_FOLIO_PROCEDIMIENTO_DATA (state, payload) {
      state.folioProcedimientoData = payload
    },

    procedimientosBandeja_RESET_FOLIO_PROCEDIMIENTO_DATA (state) {
      state.folioProcedimientoData = null
      state.estadoFolio = null
    },

    procedimientosBandeja_SET_TIENE_FOLIO (state, boolean) {
      state.tieneFolio = boolean
    },

    procedimientosBandeja_SET_LOADER (state, boolean) {
      state.loader = boolean
    },

    procedimientosBandeja_SET_ESFLAGRANTE (state, boolean) {
      state.esDenunciaDirectaFlagrante = boolean
    },

    procedimientosBandeja_ES_NUEVA_ATENCION_FISCAL (state, boolean) {
      state.esNuevaAtencionFiscal = boolean
    },

    procedimientosBandeja_SET_ESTADO_FOLIO (state, string) {
      // abierto = '1' ó null ------ cerrado = '2'
      state.estadoFolio = string
    },
    procedimientosBandeja_NEXT_STEP (state, boolean) {
      state.nextStep = boolean
    },

    procedimientosBandeja_ESFLAGRANTE_SET_DEFAULT_STATE (state) {
      state.esDenunciaDirectaFlagrante = null
    },
    procedimientosBandeja_ES_NUEVA_ATENCION_FISCAL_SET_DEFAULT_STATE (state) {
      state.esNuevaAtencionFiscal = false
    }
  }
}
