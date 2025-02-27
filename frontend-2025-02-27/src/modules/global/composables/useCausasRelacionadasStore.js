import { computed } from 'vue'
import { useStore } from 'vuex'

export const useCausasRelacionadasStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    // COMPUTED PROPERTIES
    causasRelacionadas: computed(() => state.causasRelacionadas.causasRelacionadas),
    paginacion: computed(() => state.causasRelacionadas.paginacion),

    // GETTERS

    // ACTIONS
    causasRelacionadas_consultarCausasRelacionadas: (payload) =>
      dispatch('causasRelacionadas/causasRelacionadas_consultarCausasRelacionadas', payload),
    causasRelacionadas_consultarCausasRelacionadasSaf: (payload) =>
      dispatch('causasRelacionadas/causasRelacionadas_consultarCausasRelacionadasSaf', payload),
    causasRelacionadas_guardarCausasRelacionadas: (payload) =>
      dispatch('causasRelacionadas/causasRelacionadas_guardarCausasRelacionadas', payload),
    causasRelacionadas_getCausasRelacionadas: (payload) =>
      dispatch('causasRelacionadas/causasRelacionadas_getCausasRelacionadas', payload),
    causasRelacionadas_eliminarCausasRelacionadas: (payload) =>
      dispatch('causasRelacionadas/causasRelacionadas_eliminarCausasRelacionadas', payload),

    // MUTATIONS
    causasRelacionadas_SET_DEFAULT_STATE: () =>
      commit('causasRelacionadas/causasRelacionadas_SET_DEFAULT_STATE')
  }
}
