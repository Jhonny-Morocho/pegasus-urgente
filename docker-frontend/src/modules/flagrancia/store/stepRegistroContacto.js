import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: () => ({
    folio: '',
    registroContacto: null,
    registroContactoBandeja: null,
    funcionarios: [],
    isEditando: false,
    unidadPolicialId: ''
  }),

  mutations: {
    stepRegistroContacto_SET_FOLIO (state, folio) {
      state.folio = folio
    },
    stepRegistroContacto_SET_UNIDAD_POLICIAL (state, id) {
      state.unidadPolicialId = id
    },
    stepRegistroContacto_SET_REGISTRO_CONTACTO (state, registro) {
      state.registroContacto = registro
      state.folio = registro.folioProcedimiento
      state.unidadPolicialId = registro.unidadPolicialOrganismo
    },
    stepRegistroContacto_SET_REGISTRO_CONTACTO_BANDEJA (state, registro) {
      state.registroContactoBandeja = registro
    },
    stepRegistroContacto_SET_DEFAULT_STATE (state) {
      state.registroContacto = null
      state.funcionarios = []
      state.isEditando = false
    },
    stepRegistroContacto_SET_MODO_EDICION (state, boolean) {
      state.isEditando = boolean
    },
    stepRegistroContacto_SET_DEFAULT_MODO_EDICION (state) {
      state.isEditando = false
    }
  },

  actions: {
    async stepRegistroContacto_setRegistroContacto ({ commit }, payload) {
      try {
        const request = await apiRGP.post('organismocolaborador/organismos-colaboradores/procedimiento/fiscalia', payload)
        commit('stepRegistroContacto_SET_REGISTRO_CONTACTO', request.data.data)
        commit('stepRegistroContacto_SET_REGISTRO_CONTACTO_BANDEJA', request.data)
        commit('pam/pam_SET_PROCESO', request.data.procesoPam, { root: true })
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepRegistroContacto_updateRegistroContacto ({ commit }, payload) {
      try {
        const request = await apiRGP.put('organismocolaborador/organismos-colaboradores/procedimiento/', payload)
        commit('stepRegistroContacto_SET_REGISTRO_CONTACTO', request.data)
        commit('stepRegistroContacto_SET_REGISTRO_CONTACTO_BANDEJA', request.data)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async stepRegistroContacto_getRegistroContacto ({ commit }, params) {
      try {
        const request = await apiRGP.get(`/organismocolaborador/organismos-colaboradores/procedimiento/`, { params })
        commit('stepRegistroContacto_SET_REGISTRO_CONTACTO', request.data)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
