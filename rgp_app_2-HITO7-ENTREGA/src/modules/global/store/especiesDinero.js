import { apiRGP, apiBFF } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    paginacionEspecies: null,
    especies: [],
    dineros: []
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
    async especiesDinero_addEspecie ({ commit }, payload) {
      try {
        const { data } = await apiRGP.post('/especiedinero/especies-dinero/', payload)
        return Promise.resolve(data.idEspecie)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async especiesDinero_deleteEspecie ({ commit }, payload) {
      try {
        const { idDenunciaEspecie } = payload

        const response = await apiRGP.delete(`/denuncia/denuncias/eliminar-denuncia-especie/${idDenunciaEspecie}/`)

        commit('especiesDinero_RESET_DINERO')

        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async especiesDinero_updateEspecie ({ commit }, payload) {
      try {
        const response = await apiRGP.put('/especiedinero/especies-dinero/', payload)

        commit('especiesDinero_RESET_DINERO')

        console.log('Especie a editar y respuesta: ', payload, response)

        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async especiesDinero_getEspecieByIdDenuncia ({ commit }, payload) {
      try {
        const { idDenuncia } = payload
        const { data } = await apiRGP.get(`/especiedinero/especies-dinero/denuncia-especie-dinero/${idDenuncia}`)

        commit('especiesDinero_SET_ESPECIES', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async especiesDinero_getEspecieByIdEspecie ({ _commit }, payload) {
      try {
        const { idEspecie } = payload

        const { data } = await apiRGP.get(`/especiedinero/especies-dinero/${idEspecie}`)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async especiesDinero_postManyEspeciesByIdDenuncia ({ commit }, payload) {
      try {
        const { data } = await apiRGP.post(`/especiedinero/especies-dinero/denuncia-especie-dinero-by-list/`, payload)

        commit('especiesDinero_SET_ESPECIES', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // #region BFF (🤡)
    async especiesDinero_getEspeciesEnCausa ({ commit }, payload) {
      try {
        const { ruc, params } = payload

        const { data } = await apiBFF.get(`/bff/modulo-especie-dinero/causa/${ruc}/especie-dinero`, { params })

        commit('especiesDinero_SET_ESPECIES', data.data)
        commit('especiesDinero_SET_PAGINACION_ESPECIES', data.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async especiesDinero_proponerDestinoEspecieEnCausa (_, payload) {
      try {
        const idEspecie = payload?.idEspecie
        const response = await apiBFF.patch(`/bff/modulo-especie-dinero/especie-dinero/${idEspecie}`, payload)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async especiesDinero_getEspecieEnCausaByID (_, payload) {
      try {
        const { idEspecie } = payload

        const response = await apiBFF.get(`/bff/modulo-especie-dinero/especie-dinero/${idEspecie}`)

        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async especieDinero_bff_addEspecie (_, payload) {
      try {
        const { especie, ruc } = payload

        const response = await apiBFF.post(`/bff/modulo-especie-dinero/causa/${ruc}/especie-dinero`, especie)

        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async especieDinero_bff_solicitarInspecccionVisual (_, payload) {
      try {
        const { solicitud, ruc } = payload

        const response = await apiBFF.post(`/bff/modulo-especie-dinero/causa/${ruc}/especie-dinero/solicitar-inspeccion`, solicitud)

        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async especieDinero_bff_definirDestinoEspecies (_, payload) {
      try {
        const { destinos, ruc } = payload

        const response = await apiBFF.patch(`/bff/modulo-especie-dinero/causa/${ruc}/especie-dinero/definir-destino`, destinos)

        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    }
    // #endregion
  },

  mutations: {
    especiesDinero_ADD_ESPECIE (state, payload) {
      state.especies.push(payload)
    },

    especiesDinero_DELETE_ESPECIE (state, payload) {
      state.especies = state.especies.filter((d) => d.idEspecie !== payload.idEspecie)
    },

    especiesDinero_EDIT_DINERO (state, payload) {
      state.dineros = state.dineros.map((d) => (d.idDinero === payload.idDinero ? payload : d))
    },

    especiesDinero_ADD_DINERO (state, payload) {
      state.dineros.push(payload)
      state.dineros = state.dineros.map((d) => {
        return {
          ...d,
          monto: payload.monto
        }
      })
    },

    especiesDinero_DELETE_DINERO (state, payload) {
      state.dineros = state.dineros.filter((d) => d.idDinero !== payload.idDinero)
    },

    especiesDinero_UPDATE_ESPECIE (state, payload) {
      state.especies = state.especies.map((e) => (e.idEspecie === payload.idEspecie ? payload : e))
    },

    especiesDinero_RESET_DINERO (state) {
      state.dineros = []
    },

    especiesDinero_SET_DEFAULT_STATE (state) {
      state.especies = []
      state.dineros = []
    },

    especiesDinero_SET_ESPECIES (state, payload) {
      state.especies = payload
    },

    especiesDinero_SET_PAGINACION_ESPECIES (state, payload) {
      state.paginacionEspecies = payload
    },

    especiesDinero_SET_DINERO (state, payload) {
      state.dineros = payload
    }
  }
}
