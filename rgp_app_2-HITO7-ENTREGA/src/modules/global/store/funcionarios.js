import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    funcionario: [],
    juecesPorTribunal: []
  },

  mutations: {
    funcionarios_ADD_FUNCIONARIO (state, funcionario) {
      state.funcionario = funcionario
    },
    funcionarios_ADD_FUNCIONARIO_LOCAL (state, funcionario) {
      state.funcionario.push(funcionario)
    },

    funcionarios_EDIT_FUNCIONARIO (state, { funcionario, index }) {
      state.funcionario.splice(index, 1, funcionario)
    },

    funcionarios_DELETE_FUNCIONARIO (state, index) {
      state.funcionario.splice(index, 1)
    },

    funcionarios_SET_DEFAULT_STATE (state) {
      state.funcionario = []
    },
    funcionarios_SET_JUECES_POR_TRIBUNAL (state, payload) {
      state.juecesPorTribunal = payload
    }
  },

  actions: {
    async sujetosIntervinientes_addSujeto (_, payload) {
      let idRelacionSujetoPersona = null
      try {
        const { data } = await apiRGP.post('/persona/intervinientes/', payload)
        idRelacionSujetoPersona = data.interviniente.idRelacionSujetoPersona
      } catch (error) {}
      return idRelacionSujetoPersona
    },

    async funcionarios_addFuncionario ({ _commit }, funcionario) {
      console.log(funcionario)
      try {
        const res = await apiRGP.post('/funcionario/funcionario', funcionario)
        return res.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async funcionarios_deleteFuncionario (_, payload) {
      const { idFuncionario } = payload
      console.log(payload)
      try {
        await apiRGP.delete(
          `/funcionario/funcionario/${idFuncionario}`
        )
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async funcionarios_getFuncionarioIdProcedimiento ({ commit }, payload) {
      const { idProcedimiento } = payload
      try {
        const request = await apiRGP.get(
          `/funcionario/funcionario/procedimiento/${idProcedimiento}`
        )
        commit('funcionarios_ADD_FUNCIONARIO', request.data)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async funcionarios_getFuncionarioIdDenuncia ({ commit }, payload) {
      const { idDenuncia } = payload
      try {
        const request = await apiRGP.get(
          `/funcionario/funcionario/buscar/${idDenuncia}`
        )
        commit('funcionarios_ADD_FUNCIONARIO', request.data)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async funcionarios_updateFuncionario (_, payload) {
      console.log(payload)
      const { idFuncionario, dataFuncionario } = payload
      try {
        const res = await apiRGP.put(`/funcionario/funcionario/${idFuncionario}`, dataFuncionario)
        return res.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async funcionarios_getJuecesByIdTribunal ({ commit }, payload) {
      try {
        const { idTribunal } = payload

        const { data } = await apiRGP.get(`/funcionario/funcionario/organismo/${idTribunal}`)

        commit('funcionarios_SET_JUECES_POR_TRIBUNAL', data)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response?.data)
      }
    }
  }
}
