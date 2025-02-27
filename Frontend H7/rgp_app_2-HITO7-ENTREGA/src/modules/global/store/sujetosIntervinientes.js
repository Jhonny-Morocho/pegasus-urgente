/* eslint-disable no-unreachable */
import { apiRGP } from '@/config/axios/'

export default {
  namespaced: true,

  state: () => ({
    tiposDocumento: [],
    paginacion: null,
    flags: null,
    ordenesDetencionVigentes: {},
    tablaCausasAsociadas: [
      {
        ruc: '2019205095-1',
        causa: 'Hurto Agravado',
        vif: 'No',
        rpa: 'Si',
        fechaAgrupacion: '23-01-2020',
        estado: 'Terminado'
      },
      {
        ruc: '1800938215-8',
        causa: 'Hurto Simple',
        vif: 'No',
        rpa: 'No',
        fechaAgrupacion: '23-01-2020',
        estado: 'Terminado'
      },
      {
        ruc: '2300938215-8',
        causa: 'Hurto falta 494 bis',
        vif: 'Si',
        rpa: 'No',
        fechaAgrupacion: '23-01-2020',
        estado: 'Terminado'
      }
    ],
    tablaOrdenesDetencion: [
      {
        ruc: '2019205095-1',
        fiscalia: 'ALTO HOSPICIO',
        fiscal: 'Sergio Díaz',
        delito: 'Hurto Simple por valor de 4 a 40 UTM',
        estadoCausa: 'Terminada',
        fechaOrden: '23-01-2020',
        estadoOrden: 'Cumplida',
        fechaTerminoOrden: 'Sin Información',
        tribunal: 'Juz. Garantía Iquique'
      },
      {
        ruc: '1800938215-8',
        fiscalia: 'IQUIQUE',
        fiscal: 'Sergio Díaz',
        delito: 'Infracción Art. 44',
        estadoCausa: 'Terminada',
        fechaOrden: '23-01-2020',
        estadoOrden: 'Cumplida',
        fechaTerminoOrden: 'Sin Información',
        tribunal: 'Juz. Garantía Iquique'
      },
      {
        ruc: '2300938215-8',
        fiscalia: 'TOCOPILLA',
        fiscal: 'Francisca Mayor',
        delito: 'Presunta Desgracia',
        estadoCausa: 'Terminada',
        fechaOrden: '23-01-2020',
        estadoOrden: 'Cumplida',
        fechaTerminoOrden: 'Sin Información',
        tribunal: 'Juz. Garantía Iquique'
      }
    ],
    tablaFormalizacion: [
      {
        ruc: '2019205095-1',
        audiencia: 'Control de detención',
        fechaFormalizacion: '25-05-2014',
        delito: 'Robo en lugar no habitado ART. 142',
        fiscalia: 'Ñuñoa',
        detalle:
          '    DETENCIÓN: 23-05-2014 Hasta 24-02-2014 Flagrancia: Sin Orden Judicial : No ampliación de plazo: NO juicio inmediato'
      },
      {
        ruc: '1800938215-8',
        audiencia: 'Control de detención',
        fechaFormalizacion: '30-12-2018',
        delito: 'Falsificación de licencia de conductor ART. 196',
        fiscalia: 'Ñuñoa',
        detalle:
          'DETENCIÓN: 23-12-2018 Hasta 24-03-2019 Flagrancia: Sin Orden Judicial : No ampliación de plazo: NO juicio inmediato'
      }
    ],
    tablaMedidasCautelares: [
      {
        ruc: '2019205095-1',
        nombre: 'Caso Los Quesitos',
        vif: 'No',
        rpa: 'No',
        medida: 'Resguardo Policial',
        estado: 'Vigente',
        detalleMedida: 'Sin Información'
      },
      {
        ruc: '1800938215-8',
        nombre: 'Caso Las Arañas',
        vif: 'No',
        rpa: 'No',
        medida: 'Resguardo Policial',
        estado: 'Vigente',
        detalleMedida: 'Sin Información'
      },
      {
        ruc: '2300938215-8',
        nombre: 'Caso Bomba',
        vif: 'Si',
        rpa: 'Si',
        medida: 'Resguardo Policial',
        estado: 'Vigente',
        detalleMedida: 'Sin Información'
      }
    ],
    tablaSentencias: [
      {
        ruc: '1800938215-8',
        fiscalia: 'ALTO HOSPICIO',
        fiscal: 'Sergio Díaz',
        vif: 'Si',
        rpa: 'Si',
        delito: 'HURTO SIMPLE POR UN VALOR DE MEDIA A 4 UTM',
        fechaSentencia: '23-01-2018',
        termino: 'SENTENCIA DEFINITIVA CONDENATORIA',
        procedimiento: 'Monitorio'
      },
      {
        ruc: '1800938215-8',
        fiscalia: 'IQUIQUE',
        fiscal: 'Sergio Díaz',
        vif: 'Si',
        rpa: 'No',
        delito: 'INFRACCIÓN ARTICULO 454',
        fechaSentencia: '23-01-2019',
        termino: 'SENTENCIA DEFINITIVA CONDENATORIA',
        procedimiento: 'Monitorio'
      }
    ],
    sujetos: [],
    datosHistoricosIntervinientes: [],
    medidasProteccionPersona: {
      paginacion: null,
      data: []
    }
  }),

  getters: {
    getStoreSujetosIntervinientes (state, _, rootState) {
      const { sujetos } = state
      const relaciones = rootState?.stepRelaciones?.relaciones
      return {
        sujetos,
        relaciones
      }
    }
  },

  actions: {
    async sujetosIntervinientes_addSujeto (_, payload) {
      let idRelacionSujetoPersona = null

      try {
        const { data } = await apiRGP.post('/persona/intervinientes/', payload)
        console.log(data)
        idRelacionSujetoPersona = data.interviniente.idRelacionSujeto
        return idRelacionSujetoPersona
      } catch (error) {
        return Promise.reject(error.response)
      }
    },

    async sujetosIntervinientes_updateSujeto (_, payload) {
      try {
        await apiRGP.put(`/persona/intervinientes/`, payload)
      } catch (error) {
        return Promise.reject(error.response)
      }
    },
    async sujetosIntervinientes_deleteSujeto (_, payload) {
      try {
        const { idRelacionSujeto } = payload
        await apiRGP.delete(`/persona/intervinientes/${idRelacionSujeto}`)
      } catch (error) {
        return Promise.reject(error.response)
      }
    },

    async sujetosIntervinientes_getInformacionDelictual (_, payload) {
      try {
        const idPersona = payload.idPersona
        const response = await apiRGP.get(
          `/persona/informacion-delictual/${idPersona}`
        )
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async sujetosInvervinientes_getInformacionSrcel ({ _commit }, payload) {
      try {
        const { data } = await apiRGP.get(
          `persona/intervinientes/informacion?id-tipo-documento=${payload.tipoId
          }&numero-documento=${payload.numeroId.replaceAll('.', '')}`,
          payload
        )

        return data
      } catch (error) {
        console.log('Error: ', error)
        return Promise.reject(error)
      }
    },

    async sujetosInvervinientes_getPoseeOrdenesDetencion ({ commit }, payload) {
      const { tipoDocumento, numero } = payload
      try {
        const response = await apiRGP.get(
          `/ordendetencionvigente/existe-orden-detencion-vigente/${tipoDocumento}/${numero.replaceAll('.', '')}`,
          payload
        )

        commit(
          'sujetosIntervinientes_SET_ORDENES_DETENCION_VIGENTES',
          response.data
        )

        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async sujetosIntervinientes_getDatosHistoricos ({ commit }, payload) {
      try {
        const res = await apiRGP.post(
          `/persona/intervinientes/datos-historicos-inverviniente/`,
          payload
        )
        commit('sujetosIntervinientes_GET_DATOS_HISTORICOS', res.data)
        return res.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async sujetosIntervinientes_getSujetosByIdGlobal ({ commit }, payload) {
      try {
        const { idDenuncia, params } = payload
        const { data } = await apiRGP.get(
          `/persona/relacion-clase/${idDenuncia}`,
          { params }
        )

        commit('sujetosIntervinientes_SET_SUJETOS', data?.data)
        commit(
          'sujetosIntervinientes_SET_PAGINACION_SUJETOS',
          data?.paginacion
        )
        commit('sujetosIntervinientes_SET_FLAGS_SUJETOS', data?.flags)

        return data
      } catch (error) {
        return Promise.reject(error.response)
      }
    },
    async sujetosIntervinientes_getSujetosByIdRelacionSujeto (_, payload) {
      try {
        const { idRelacionSujeto } = payload

        const response = await apiRGP.get(
          `/persona/intervinientes/${idRelacionSujeto}`
        )
        return response?.data
      } catch (error) {
        return Promise.reject(error.response)
      }
    },

    // #region Medidas de Proteccion de un Sujeto (CRUD)
    async sujetosIntervinientes_getMedidasProteccionPersonaById (
      { commit },
      payload
    ) {
      try {
        const { idPersona, params } = payload

        const { data } = await apiRGP.get(
          `persona/persona/${idPersona}/medida-proteccion`,
          { params }
        )

        commit('sujetosIntervinientes_SET_MEDIDAS_PROTECCION_PERSONA', {
          paginacion: data?.paginacion,
          data: data?.data
        })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async sujetosIntervinientes_postAgregarMedidaProteccion ({ _ }, payload) {
      try {
        const { data } = await apiRGP.post(
          'persona/persona/medida-proteccion',
          payload
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async sujetosIntervinientes_deleteMediaProteccionById ({ _ }, payload) {
      try {
        const { idMedida } = payload

        const { data } = await apiRGP.delete(
          `persona/persona/medida-proteccion/${idMedida}`
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion

    async sujetosIntervinientes_getManySujetosByIdDenuncia ({ commit }, payload) {
      try {
        const { data } = await apiRGP.post(`/persona/relacion-clase/get-all-by-list`, payload)

        commit('sujetosIntervinientes_SET_SUJETOS', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error.response)
      }
    }
  },

  mutations: {
    sujetosIntervinientes_ADD_SUJETO (state, payload) {
      state.sujetos.push(payload)
    },
    sujetosIntervinientes_UPDATE_SUJETO (state, payload) {
      state.sujetos = state.sujetos.map((s) =>
        s.idPersona === payload.idPersona ? payload : s
      )
    },
    sujetosIntervinientes_SET_SUJETOS (state, sujetos) {
      state.sujetos = sujetos
    },
    sujetosIntervinientes_SET_DEFAULT_STATE (state) {
      state.sujetos = []
    },
    sujetosIntervinientes_GET_DATOS_HISTORICOS (state, payload) {
      state.datosHistoricosIntervinientes = payload
    },

    sujetosIntervinientes_SET_PAGINACION_SUJETOS (state, payload) {
      state.paginacion = payload
    },
    sujetosIntervinientes_SET_FLAGS_SUJETOS (state, payload) {
      state.flags = payload
    },
    sujetosIntervinientes_SET_ORDENES_DETENCION_VIGENTES (state, payload) {
      state.ordenesDetencionVigentes = payload
    },
    sujetosIntervinientes_SET_MEDIDAS_PROTECCION_PERSONA (state, payload) {
      state.medidasProteccionPersona.paginacion = payload.paginacion
      state.medidasProteccionPersona.data = payload.data
    }
  }
}
