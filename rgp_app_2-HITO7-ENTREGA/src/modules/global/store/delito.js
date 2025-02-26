import { apiRGP, apiBFF } from '@/config/axios/'

export default {
  namespaced: true,

  state: () => ({
    mediosTransporte: [],
    delitos: [],
    paginacion: []
  }),

  getters: {
    getStoreDelitos (state) {
      const { delitos } = state

      return {
        delitos
      }
    }
  },

  mutations: {
    delito_ADD_MEDIO_TRANSPORTE (state, medioTransporte) {
      state.mediosTransporte.push(medioTransporte)
    },

    delito_EDIT_MEDIO_TRANSPORTE (state, medioTransporte) {
      state.mediosTransporte = state.mediosTransporte.map((m) =>
        m.idMedioTransporte === medioTransporte.idMedioTransporte
          ? medioTransporte
          : m
      )
    },

    delito_DELETE_MEDIO_TRANSPORTE (state, medioTransporte) {
      state.mediosTransporte = state.mediosTransporte.filter(
        (medioAEliminar) =>
          medioAEliminar.idMedioTransporte !== medioTransporte.idMedioTransporte
      )
    },

    delito_SET_MEDIOSTRANSPORTE (state, mediosTransporte) {
      state.mediosTransporte = mediosTransporte || []
    },
    delito_RESET_MEDIOSTRANSPORTE (state) {
      state.mediosTransporte = []
    },

    delito_ADD_DELITO (state, delito) {
      state.delitos.push(delito)
    },

    delito_SET_PAGINACION_DELITOS (state, payload) {
      state.paginacion = payload
    },

    delito_UPDATE_DELITO (state, payload) {
      const delitoEditado = payload
      state.delitos = state.delitos.map((d) =>
        d.idDetalleHechoDelictual === delitoEditado.idDetalleHechoDelictual
          ? delitoEditado
          : d
      )
    },

    delito_DELETE_DELITO (state, delito) {
      state.delitos = state.delitos.filter(
        (delitoAEliminar) =>
          delitoAEliminar.idDetalleHechoDelictual !==
          delito.idDetalleHechoDelictual
      )
    },

    delito_SET_DELITOS (state, delitos) {
      state.delitos = delitos
    },

    delito_SET_DEFAULT_STATE (state) {
      state.mediosTransporte = []
      state.delitos = []
      state.paginacion = null
    },

    delito_SET_DELITOS_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    }
  },

  actions: {
    async delito_addDelito ({ _commit }, payload) {
      let idDelito = null
      await apiRGP
        .post('denuncia/hecho-delictual/crear-detalle-delito', payload)
        .then((res) => {
          idDelito = res.data.idDetalleHechoDelictual
        })
      return idDelito
    },

    async delito_deleteDelito ({ commit }, payload) {
      const idDetalleHechoDelictual = payload.idDetalleHechoDelictual
      try {
        const response = await apiRGP.delete(
          `/denuncia/hecho-delictual/${idDetalleHechoDelictual}`
        )
        commit('delito_DELETE_DELITO', response)
      } catch (error) {
        return Promise.reject
      }
    },

    async delito_updateDelito ({ _commit }, delito) {
      try {
        const response = await apiRGP.put('/denuncia/hecho-delictual/actualizar-denuncia', delito)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async delito_crearDenuncia ({ _commit }, payload) {
      const nuevaDenuncia = {
        idTipoDenuncia: 'string',
        idOrigen: 'string',
        fechaOcurrencia: payload?.fechaHoraRango
          ? payload.fechaHoraDelitoInicio
          : payload?.fechaOcurrencia
      }

      return apiRGP
        .post('denuncia/hecho-delictual/crear-denuncia', nuevaDenuncia)
        .then((res) => {
          return {
            idDenuncia: res.data?.idDenuncia,
            numeroDenuncia: res.data?.numeroDenuncia
          }
        })
    },

    async delito_getDelitoByIdDenuncia ({ commit }, payload) {
      const { params, idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(`denuncia/hecho-delictual/${idDenuncia}`, { params })

        commit('delito_SET_DELITOS', data?.data)
        commit('delito_SET_DELITOS_PAGINACION', data?.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async delito_getDelitoByIdDetalleHechoDelictual (_, payload) {
      try {
        const { idDetalleHechoDelictual } = payload

        const { data } = await apiRGP.get(`/denuncia/hecho-delictual/id/${idDetalleHechoDelictual}`)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async delito_postManyDelitosByIdDenuncia ({ commit }, payload) {
      const { params } = payload

      try {
        const { data } = await apiRGP.post(`denuncia/hecho-delictual/lista`, payload, { params })

        commit('delito_SET_DELITOS', data?.data)
        commit('delito_SET_DELITOS_PAGINACION', data?.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // BFF (🤡)
    async delito_getDelitosEnCausa ({ commit }, payload) {
      try {
        // Hacer esto mientras backend disponibiliza el get by idGlobal
        const { params, ruc } = payload

        const { data } = await apiBFF.get(
          `/bff/modulo-delito/causa/${ruc}/delito`,
          { params }
        )

        commit('delito_SET_DELITOS', data?.data)
        commit('delito_SET_PAGINACION_DELITOS', data?.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
