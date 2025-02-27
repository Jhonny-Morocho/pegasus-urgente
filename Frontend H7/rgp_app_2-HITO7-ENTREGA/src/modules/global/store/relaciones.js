import { apiRGP, apiBFF } from '@/config/axios'

export default {
  namespaced: true,

  state: () => ({
    relacionesConMedidas: [],
    paginacionRelacionesConMedidas: null,
    relacionesConMedidasSegundaTabla: [],
    paginacionRelacionesConMedidasSegundaTabla: null,
    relaciones: [],
    paginacion: null,
    parentesco: [],
    paginacionParentesco: null
  }),

  actions: {
    // #region 'Relaciones'
    async relaciones_addRelacion ({ _commit }, payloadRelacion) {
      try {
        const response = await apiRGP.post('relacion/relaciones/', payloadRelacion)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async relaciones_getRelaciones ({ commit }, payload) {
      try {
        const response = await apiRGP.get(
          `/relacion/relaciones/${payload.idDenuncia}`
        )
        const filtro = response.data.data ? response.data.data : response.data
        commit('relaciones_SET_RELACIONES', filtro)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async relaciones_deleteRelacion ({ _commit }, payload) {
      try {
        const response = await apiRGP.delete(
          `/relacion/relaciones/${payload.idRelacionDelito}`
        )
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async relaciones_editRelacion ({ _commit }, relacion) {
      try {
        await apiRGP.put(`relacion/relaciones/`, relacion)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion

    // #region 'Relacion y sus Estados'
    async relaciones_putActualizarEstadoRelacion ({ _ }, payload) {
      try {
        const payloadParsed = {
          idsRelaciones: payload.idsRelaciones, // el id de la relacion
          idEstadoRelacion: payload.idEstadoRelacion // el id obtenido desde el mantenedor de estados relacion
        }

        const response = await apiRGP.put(
          `/relacion/relaciones/actualizar-estado`,
          payloadParsed
        )

        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async relaciones_getRelacionesCausaUltimaDirectriz (_, payload) {
      try {
        const { idDenuncia } = payload

        const { data } = await apiRGP.get(`/relacion/relaciones/directriz/${idDenuncia}`)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },
    // #endregion

    // #region 'Relacion Sujeto con medidas'
    async relaciones_getRelacionesConMedidasCautelares ({ commit }, payload) {
      try {
        const { params } = payload
        // esSegundaTabla por default viene sin nada,
        // en caso de que tengas dos tablas en la vista setea a la segunda esSegundaTabla: true
        // ó trabaja directo con el resolve sin el store
        const res = await apiRGP.get(`/relacion/relacion-medidas`, { params })
        if (!payload.esSegundaTabla) {
          commit(
            'relaciones_SET_RELACIONES_CON_MEDIDAS_CAUTELARES',
            res.data?.data
          )
          commit(
            'relaciones_SET_PAGINACION_RELACIONES_CON_MEDIDAS_CAUTELARES',
            res.data?.paginacion
          )
        } else {
          commit(
            'relaciones_SET_RELACIONES_CON_MEDIDAS_CAUTELARES_SEGUNDA_TABLA',
            res.data?.data
          )
          commit(
            'relaciones_SET_PAGINACION_RELACIONES_CON_MEDIDAS_CAUTELARES_SEGUNDA_TABLA',
            res.data?.paginacion
          )
        }
        return res.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async relaciones_postAgregarMedidaCautelar ({ _ }, payload) {
      try {
        const { data } = await apiRGP.post(
          `/relacion/relacion-medidas`,
          payload
        )
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion
    async relaciones_deleteMedidaCautelar ({ _ }, payload) {
      try {
        const { data } = await apiRGP.delete(
          `/relacion/relacion-medidas/${payload.idMedida}`,
          payload
        )
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async relaciones_postManyRelacionesByIdDenuncia ({ commit }, payload) {
      try {
        const { data } = await apiRGP.post(`/relacion/relaciones/relaciones-by-list`, payload)

        const filtro = data.data ? data.data : data
        commit('relaciones_SET_RELACIONES', filtro)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async relaciones_getByIdRelacionDelito ({ commit }, payload){
      try {
        const response = await apiRGP.get(`/relacion/relaciones/relacion-delito/${payload.idRelacionDelito}`)
        commit('relaciones_ADD_RELACION', response.data)
        return Promise.resolve(response.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // #region BFF (🤡)
    // DEBE ELIMINARSE
    async relaciones_getRelacionesEnCausa ({ commit }, payload) {
      try {
        const { ruc, params } = payload

        const { data } = await apiBFF.get(
          `/bff/modulo-relacion/causa/${ruc}/relacion`,
          { params }
        )

        commit('relaciones_SET_RELACIONES', data?.data)
        commit('relaciones_SET_PAGINACION', data?.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion

    // #region 'Parentesco'
    async relaciones_addParentesco (_, payloadParentesco) {
      try {
        const response = await apiRGP.post(
          'relacion/relacion-afinidad/',
          payloadParentesco
        )
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async relaciones_getParentesco ({ commit }, payload) {
      const { params } = payload

      try {
        const response = await apiRGP.get(
          `/relacion/relacion-afinidad/${payload.idDenuncia}`,
          { params }
        )
        commit('relaciones_SET_PARENTESCO', response.data.data)
        commit(
          'relaciones_SET_PAGINACION_PARENTESCO',
          response.data.paginacion
        )
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async relaciones_deleteParentesco (_, payload) {
      try {
        const response = await apiRGP.delete(
          `/relacion/relacion-afinidad/${payload.idRelacionAfinidad}`
        )
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async relaciones_editParentesco (_, parentesco) {
      try {
        await apiRGP.put(
          `/relacion/relacion-afinidad/${parentesco.idRelacionAfinidad}`,
          parentesco
        )
      } catch (error) {
        return Promise.reject(error)
      }
    }
    // #endregion
  },
  mutations: {
    relaciones_ADD_RELACION (state, payload) {
      state.relaciones.push(payload)
    },
    relaciones_SET_RELACIONES_CON_MEDIDAS_CAUTELARES (state, relacionesMedidas) {
      state.relacionesConMedidas = relacionesMedidas
    },
    relaciones_SET_PAGINACION_RELACIONES_CON_MEDIDAS_CAUTELARES (
      state,
      paginacion
    ) {
      state.paginacionRelacionesConMedidas = paginacion
    },
    relaciones_SET_RELACIONES_CON_MEDIDAS_CAUTELARES_DEFAULT_STATE (state) {
      state.relacionesConMedidas = []
    },
    relaciones_SET_RELACIONES_CON_MEDIDAS_CAUTELARES_SEGUNDA_TABLA (
      state,
      relacionesMedidas
    ) {
      state.relacionesConMedidasSegundaTabla = relacionesMedidas
    },
    relaciones_SET_PAGINACION_RELACIONES_CON_MEDIDAS_CAUTELARES_SEGUNDA_TABLA (
      state,
      paginacion
    ) {
      state.paginacionRelacionesConMedidasSegundaTabla = paginacion
    },
    relaciones_SET_RELACIONES_CON_MEDIDAS_CAUTELARES_SEGUNDA_TABLA_DEFAULT_STATE (
      state
    ) {
      state.relacionesConMedidasSegundaTabla = []
    },
    relaciones_SET_RELACIONES (state, relaciones) {
      state.relaciones = relaciones
    },

    relaciones_SET_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    },

    relaciones_SET_DEFAULT_STATE (state) {
      state.relaciones = []
    },

    relaciones_SET_PARENTESCO (state, relaciones) {
      state.parentesco = relaciones
    },

    relaciones_SET_PAGINACION_PARENTESCO (state, paginacion) {
      state.paginacionParentesco = paginacion
    },

    relaciones_SET_PARENTESCO_DEFAULT_STATE (state) {
      state.parentesco = []
    }
  }
}
