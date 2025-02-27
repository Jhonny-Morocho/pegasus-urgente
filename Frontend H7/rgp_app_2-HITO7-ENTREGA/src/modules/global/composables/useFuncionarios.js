import { computed } from 'vue'
import { useStore } from 'vuex'

export const useFuncionarios = () => {
  const { state, commit, dispatch } = useStore()

  return {
    funcionario: computed(() => state.funcionarios.funcionario),
    juecesPorTribunal: computed(() => state.funcionarios.juecesPorTribunal),

    // mutations
    funcionarios_ADD_FUNCIONARIO: (funcionario) =>
      commit('funcionarios/funcionarios_ADD_FUNCIONARIO', funcionario),
    funcionarios_ADD_FUNCIONARIO_LOCAL: (funcionario) =>
      commit('funcionarios/funcionarios_ADD_FUNCIONARIO_LOCAL', funcionario),
    funcionarios_EDIT_FUNCIONARIO: ({ funcionario, index }) =>
      commit('funcionarios/funcionarios_EDIT_FUNCIONARIO', { funcionario, index }),
    funcionarios_DELETE_FUNCIONARIO: (index) =>
      commit('funcionarios/funcionarios_DELETE_FUNCIONARIO', index),
    funcionarios_SET_DEFAULT_STATE: () =>
      commit('funcionarios/funcionarios_SET_DEFAULT_STATE'),

    // actions
    funcionarios_addFuncionario: (funcionario) =>
      dispatch('funcionarios/funcionarios_addFuncionario', funcionario),
    funcionarios_getFuncionarioIdProcedimiento: (idProcedimiento) =>
      dispatch('funcionarios/funcionarios_getFuncionarioIdProcedimiento', idProcedimiento),
    funcionarios_getFuncionarioIdDenuncia: (idDenuncia) =>
      dispatch('funcionarios/funcionarios_getFuncionarioIdDenuncia', idDenuncia),
    funcionarios_deleteFuncionario: (idFuncionario) =>
      dispatch('funcionarios/funcionarios_deleteFuncionario', idFuncionario),
    funcionarios_updateFuncionario: (funcionario) =>
      dispatch('funcionarios/funcionarios_updateFuncionario', funcionario),
    funcionarios_getJuecesByIdTribunal: (funcionario) =>
      dispatch('funcionarios/funcionarios_getJuecesByIdTribunal', funcionario)
  }
}
