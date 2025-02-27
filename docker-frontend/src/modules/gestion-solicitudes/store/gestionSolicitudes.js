import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    actividad: '',
    ruc: '',
    denuncias: [],
    idDenuncia: '',
    idCausa: '',
    paginacion: null,
    pautasAplicadas: [],
    medidasProteccion: [],
    medidasCautelares: [],
    anotaciones: [],
    diligencias: [],
    minutas: [],
    antecedentes: [],
    pideCuenta: [],
    nuevoPideCuenta: [],
    documentosAdjuntos: [],
    solicitud: [],
    resultadoSolicitudOtraFiscalia: [],
    causa: [],
    listaImputados: [],
    dataSelector: null,
    pamGDS: null
  },

  actions: {
    async gestionSolicitudes_getActividad ({ commit }, payload) {
      try {
        const { data } = await apiRGP.get(`/actividad/actividad/solicitud/${payload.idTarea}`)
        commit('gestionSolicitudes_SET_ACTIVIDAD', data)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async gestionSolicitudes_actualizarActividad ({ commit }, payload) {
      const { idActividad, contract } = payload
      try {
        const { data } = await apiRGP.put(`/actividad/actividad/solicitud/${idActividad}`, contract)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async gestionSolicitudes_getPautasAplicadas ({ commit }, payload) {
      const { idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(`/endpoint/${idDenuncia}/resumen`)

        commit('gestionSolicitudes_SET_PAUTAS_APLICADAS', data)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async gestionSolicitudes_getMedidasProteccion ({ commit }, payload) {
      const { idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(`/endpoint/${idDenuncia}/resumen`)

        commit('gestionSolicitudes_SET_MEDIDAS_PROTECCION', data)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async gestionSolicitudes_getMedidasCautelares ({ commit }, payload) {
      const { idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(`/endpoint/${idDenuncia}/resumen`)

        commit('gestionSolicitudes_SET_MEDIDAS_CAUTELARES', data)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async gestionSolicitudes_getAnotaciones ({ commit }, payload) {
      const { idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(`/endpoint/${idDenuncia}/resumen`)

        commit('gestionSolicitudes_SET_ANOTACIONES', data)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async gestionSolicitudes_getDiligencias ({ commit }, payload) {
      const { idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(`/endpoint/${idDenuncia}/resumen`)

        commit('gestionSolicitudes_SET_DILIGENCIAS', data)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async gestionSolicitudes_getMinutas ({ commit }, payload) {
      const { idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(`/endpoint/${idDenuncia}/resumen`)

        commit('gestionSolicitudes_SET_MINUTAS', data)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },

    // #region Ampliacion de plazo solicitud
    async gestionSolicitudes_getAntecedentes ({ commit }, payload) {
      const { idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(`/endpoint/${idDenuncia}/resumen`)

        commit('gestionSolicitudes_GET_ANTECEDENTES', data)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async gestionSolicitudes_getSolicitud ({ commit }, payload) {
      const { idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(`/endpoint/${idDenuncia}/resumen`)

        commit('gestionSolicitudes_SET_SOLICITUD', data)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async gestionSolicitudes_getPideCuentaAutomatico ({ commit }, payload) {
      const { idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(`/endpoint/${idDenuncia}/resumen`)

        commit('gestionSolicitudes_SET_PIDE_CUENTA_AUTOMATICO', data)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async gestionSolicitudes_getNuevoPideCuenta ({ commit }, payload) {
      const { idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(`/endpoint/${idDenuncia}/resumen`)

        commit('gestionSolicitudes_SET_NUEVO_PIDE_CUENTA', data)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async gestionSolicitudes_getDocumentosAdjuntos ({ commit }, payload) {
      const { idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(`/endpoint/${idDenuncia}/resumen`)

        commit('gestionSolicitudes_SET_DOCUMENTOS_ADJUNTOS', data)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },

    async gestionSolicitudes_postResponderSolicitudAmpliacionPlazo (
      { _ },
      payload
    ) {
      const { idDenuncia, formData } = payload

      try {
        const { data } =
          await apiRGP.get(`endpoints/${idDenuncia}/enviar-solicitud-ampliacion-plazo/`,
            formData)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },

    async gestionSolicitudes_postElaborarEscritoPideCuenta ({ _ }, payload) {
      const { idDenuncia, formData } = payload

      try {
        const { data } =
          await apiRGP.get(`endpoints/${idDenuncia}/enviar-solicitud-ampliacion-plazo/`,
            formData)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async gestionSolicitudes_getPlantillaPideCuenta ({ _ }, payload) {
      const { idPlantillaPideCuenta } = payload

      try {
        const { data } =
          await apiRGP.get(`endpoints/${idPlantillaPideCuenta}/getPLantilla/`)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    // #endregion

    async gestionSolicitudes_getPlantillaMaterializaFiscal ({ _ }, payload) {
      const { idPlantilla } = payload

      try {
        const { data } = await apiRGP.get(`endpoints/${idPlantilla}/getPLantilla/`)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },

    async gestionSolicitudes_getRespuestaSolicitudOtraFiscalia (
      { commit },
      payload
    ) {
      const { idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(`/endpoint/${idDenuncia}/resumen`)

        commit('gestionSolicitudes_RESULTADO_SOLICITUD_OTRA_FISCALIA', data)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async gestionSolicitudes_getDataFromPjud ({ commit }, payload) {
      const { idCausa } = payload
      try {
        const { data } = await apiRGP.get(`/actividad/actividad?id-origen-actividad=${idCausa}`)
        commit('gestionSolicitudes_SET_DATA_FROM_PJUD', data)
        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    }
  },

  mutations: {
    gestionSolicitudes_SET_ACTIVIDAD (state, data) {
      state.actividad = data
    },
    gestionSolicitudes_SET_CAUSA (state, data) {
      state.causa = data
    },
    gestionSolicitudes_SET_BANDEJA (state, data) {
      state.denuncias = data
    },
    gestionSolicitudes_SET_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    },
    gestionSolicitudes_SET_BANDEJA_FISCAL (state, data) {
      state.denuncias = data
    },
    gestionSolicitudes_SET_BANDEJA_EJECUTOR (state, data) {
      state.denuncias = data
    },
    gestionSolicitudes_SET_PAUTAS_APLICADAS (state, data) {
      state.pautasAplicadas = data
    },
    gestionSolicitudes_SET_MEDIDAS_PROTECCION (state, data) {
      state.medidasProteccion = data
    },
    gestionSolicitudes_SET_MEDIDAS_CAUTELARES (state, data) {
      state.medidasCautelares = data
    },
    gestionSolicitudes_SET_ANOTACIONES (state, data) {
      state.anotaciones = data
    },
    gestionSolicitudes_SET_DILIGENCIAS (state, data) {
      state.diligencias = data
    },
    gestionSolicitudes_SET_MINUTAS (state, data) {
      state.minutas = data
    },
    // #region solicitud Ampliacion plazo
    gestionSolicitudes_GET_ANTECEDENTES (state, data) {
      state.antecedentes = data
    },
    gestionSolicitudes_SET_SOLICITUD (state, data) {
      state.solicitud = data
    },
    gestionSolicitudes_SET_PIDE_CUENTA_AUTOMATICO (state, data) {
      state.pideCuentaAutomatico = data
    },
    gestionSolicitudes_SET_NUEVO_PIDE_CUENTA (state, data) {
      state.nuevoPideCuenta = data
    },
    gestionSolicitudes_SET_DOCUMENTOS_ADJUNTOS (state, data) {
      state.documentosAdjuntos = data
    },
    // #endregion
    gestionSolicitudes_RESULTADO_SOLICITUD_OTRA_FISCALIA (state, data) {
      state.resultadoSolicitudOtraFiscalia = data
    },
    gestionSolicitudes_SET_DATA_FROM_PJUD (state, data) {
      state.solicitudesPjud = data
    }
  }
}
